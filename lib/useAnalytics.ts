'use client';

import * as analytics from './analytics';

/**
 * Custom hook for easy analytics tracking in components
 * 
 * Usage:
 * const { trackEvent, trackSearch, trackPlaceView } = useAnalytics();
 * 
 * Note: The functions are stable references from the analytics module
 * and don't need memoization.
 */
export function useAnalytics() {
  // Return the analytics functions directly
  // These are stable references and don't need useCallback
  return {
    trackEvent: analytics.trackEvent,
    trackPageView: analytics.trackPageView,
    trackSearch: analytics.trackSearch,
    trackPlaceView: analytics.trackPlaceView,
    trackPlaceClick: analytics.trackPlaceClick,
    trackPlaceDirections: analytics.trackPlaceDirections,
    trackPlaceWebsite: analytics.trackPlaceWebsite,
    trackPlaceCall: analytics.trackPlaceCall,
    trackFilter: analytics.trackFilter,
    trackClearFilters: analytics.trackClearFilters,
    trackMapInteraction: analytics.trackMapInteraction,
    trackProductView: analytics.trackProductView,
    trackProductClick: analytics.trackProductClick,
    trackDonationStart: analytics.trackDonationStart,
    trackDonationComplete: analytics.trackDonationComplete,
    trackLogin: analytics.trackLogin,
    trackSignup: analytics.trackSignup,
    trackLogout: analytics.trackLogout,
    trackNavigation: analytics.trackNavigation,
    trackEpisodeView: analytics.trackEpisodeView,
    trackEpisodeClick: analytics.trackEpisodeClick,
    trackShare: analytics.trackShare,
    trackOutboundLink: analytics.trackOutboundLink,
    trackCTA: analytics.trackCTA,
    trackFormSubmit: analytics.trackFormSubmit,
    trackVideoPlay: analytics.trackVideoPlay,
    trackError: analytics.trackError,
  };
}

