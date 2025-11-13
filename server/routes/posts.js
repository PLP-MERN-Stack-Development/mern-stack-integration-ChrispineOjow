// posts.js - Post routes

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/posts
// @desc    Get all posts with pagination, search, and filtering
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.q;
    const isPublished = req.query.published !== 'false';

    // Build query
    let query = {};
    if (isPublished) {
      query.isPublished = true;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/posts/search
// @desc    Search posts
// @access  Public
router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const posts = await Post.find({
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single post
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    })
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .populate('comments.user', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post(
  '/',
  protect,
  upload.single('featuredImage'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: errors.array()[0].msg,
        });
      }

      // Check if category exists
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        });
      }

      const postData = {
        ...req.body,
        author: req.user._id,
      };

      // Handle tags - can come as array or comma-separated string
      if (req.body.tags) {
        if (Array.isArray(req.body.tags)) {
          postData.tags = req.body.tags.filter(tag => tag.trim());
        } else if (typeof req.body.tags === 'string') {
          postData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      // Handle file upload
      if (req.file) {
        postData.featuredImage = req.file.filename;
      }

      const post = await Post.create(postData);
      await post.populate('author', 'name email');
      await post.populate('category', 'name slug');

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put(
  '/:id',
  protect,
  upload.single('featuredImage'),
  async (req, res, next) => {
    try {
      let post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      // Check if user is author or admin
      if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this post',
        });
      }

      // Handle file upload
      if (req.file) {
        req.body.featuredImage = req.file.filename;
      }

      // Handle tags - can come as array or comma-separated string
      if (req.body.tags) {
        if (Array.isArray(req.body.tags)) {
          req.body.tags = req.body.tags.filter(tag => tag.trim());
        } else if (typeof req.body.tags === 'string') {
          req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      // Update category if provided
      if (req.body.category) {
        const category = await Category.findById(req.body.category);
        if (!category) {
          return res.status(404).json({
            success: false,
            error: 'Category not found',
          });
        }
      }

      post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate('author', 'name email')
        .populate('category', 'name slug');

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post(
  '/:id/comments',
  protect,
  [body('content').trim().notEmpty().withMessage('Comment content is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: errors.array()[0].msg,
        });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      post.comments.push({
        user: req.user._id,
        content: req.body.content,
      });

      await post.save();
      await post.populate('comments.user', 'name email');
      await post.populate('author', 'name email');
      await post.populate('category', 'name slug');

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

