import { useState, useContext, createContext } from "react";
import PropTypes from "prop-types";

export const ContentEditorContext = createContext({});

export function ContentEditorProvider({ children }) {
    const [pageEditContent, setPageEditContent] = useState({});

    return <ContentEditorContext.Provider value={{ pageEditContent, setPageEditContent }}>{children}</ContentEditorContext.Provider>;
}

ContentEditorProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useContentEditorContext = () => useContext(ContentEditorContext);
