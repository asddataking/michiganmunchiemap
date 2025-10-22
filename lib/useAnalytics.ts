'use client';

import { useCallback } from 'react';
import * as analytics from './analytics';

/**
 * Custom hook for easy analytics tracking in components
 * 
 * Usage:
 * const { trackEvent, trackSearch, trackPlaceView } = useAnalytics();
 */
export function useAnalytics() {
  // Wrap all analytics functions in useCallback for performance
  const trackEvent = useCallback(analytics.trackEvent, []);
  const trackPageView = useCallback(analytics.trackPageView, []);
  const trackSearch = useCallback(analytics.trackSearch, []);
  const trackPlaceView = useCallback(analytics.trackPlaceView, []);
  const trackPlaceClick = useCallback(analytics.trackPlaceClick, []);
  const trackPlaceDirections = useCallback(analytics.trackPlaceDirections, []);
  const trackPlaceWebsite = useCallback(analytics.trackPlaceWebsite, []);
  const trackPlaceCall = useCallback(analytics.trackPlaceCall, []);
  const trackFilter = useCallback(analytics.trackFilter, []);
  const trackClearFilters = useCallback(analytics.trackClearFilters, []);
  const trackMapInteraction = useCallback(analytics.trackMapInteraction, []);
  const trackProductView = useCallback(analytics.trackProductView, []);
  const trackProductClick = useCallback(analytics.trackProductClick, []);
  const trackDonationStart = useCallback(analytics.trackDonationStart, []);
  const trackDonationComplete = useCallback(analytics.trackDonationComplete, []);
  const trackLogin = useCallback(analytics.trackLogin, []);
  const trackSignup = useCallback(analytics.trackSignup, []);
  const trackLogout = useCallback(analytics.trackLogout, []);
  const trackNavigation = useCallback(analytics.trackNavigation, []);
  const trackEpisodeView = useCallback(analytics.trackEpisodeView, []);
  const trackEpisodeClick = useCallback(analytics.trackEpisodeClick, []);
  const trackShare = useCallback(analytics.trackShare, []);
  const trackOutboundLink = useCallback(analytics.trackOutboundLink, []);
  const trackCTA = useCallback(analytics.trackCTA, []);
  const trackFormSubmit = useCallback(analytics.trackFormSubmit, []);
  const trackVideoPlay = useCallback(analytics.trackVideoPlay, []);
  const trackError = useCallback(analytics.trackError, []);

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackPlaceView,
    trackPlaceClick,
    trackPlaceDirections,
    trackPlaceWebsite,
    trackPlaceCall,
    trackFilter,
    trackClearFilters,
    trackMapInteraction,
    trackProductView,
    trackProductClick,
    trackDonationStart,
    trackDonationComplete,
    trackLogin,
    trackSignup,
    trackLogout,
    trackNavigation,
    trackEpisodeView,
    trackEpisodeClick,
    trackShare,
    trackOutboundLink,
    trackCTA,
    trackFormSubmit,
    trackVideoPlay,
    trackError,
  };
}

