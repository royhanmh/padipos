import { useEffect } from "react";

const APP_NAME = "PadiPOS";

/**
 * Updates the document.title on mount and unmount.
 * @param {string} title - The specific title for the current page.
 * @param {boolean} suffix - Whether to add the application name as a suffix.
 */
const DocumentTitle = ({ title, suffix = true }) => {
  useEffect(() => {
    const previousTitle = document.title;
    const nextTitle = suffix ? `${title} | ${APP_NAME}` : title;

    document.title = nextTitle;

    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);

  return null;
};

export default DocumentTitle;
