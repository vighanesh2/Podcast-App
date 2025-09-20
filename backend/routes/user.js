const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('profile.firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('profile.lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('profile.sleepPreferences.preferredSleepTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time format (HH:MM)'),
  body('profile.sleepPreferences.wakeUpTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time format (HH:MM)')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { profile } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          'profile.firstName': profile?.firstName,
          'profile.lastName': profile?.lastName,
          'profile.sleepPreferences.preferredSleepTime': profile?.sleepPreferences?.preferredSleepTime,
          'profile.sleepPreferences.wakeUpTime': profile?.sleepPreferences?.wakeUpTime,
          'profile.sleepPreferences.favoritePodcastCategories': profile?.sleepPreferences?.favoritePodcastCategories
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   GET /api/user/listening-history
// @desc    Get user's listening history
// @access  Private
router.get('/listening-history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const user = await User.findById(userId).select('listeningHistory');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const listeningHistory = user.listeningHistory
      .sort((a, b) => new Date(b.listenedAt) - new Date(a.listenedAt))
      .slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        listeningHistory,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(user.listeningHistory.length / limit),
          totalItems: user.listeningHistory.length
        }
      }
    });

  } catch (error) {
    console.error('Get listening history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching listening history'
    });
  }
});

// @route   POST /api/user/listening-history
// @desc    Add to listening history
// @access  Private
router.post('/listening-history', [
  body('podcastId').notEmpty().withMessage('Podcast ID is required'),
  body('podcastTitle').notEmpty().withMessage('Podcast title is required'),
  body('duration').isNumeric().withMessage('Duration must be a number')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { podcastId, podcastTitle, duration, completed = false } = req.body;
    const userId = req.user._id;

    const listeningEntry = {
      podcastId,
      podcastTitle,
      duration,
      completed,
      listenedAt: new Date()
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { listeningHistory: listeningEntry } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Listening history updated',
      data: {
        listeningEntry
      }
    });

  } catch (error) {
    console.error('Add listening history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating listening history'
    });
  }
});

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Soft delete - deactivate account instead of hard delete
    await User.findByIdAndUpdate(userId, { isActive: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting account'
    });
  }
});

module.exports = router;
