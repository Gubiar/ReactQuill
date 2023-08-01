import { useState, useContext, createContext } from "react";
import PropTypes from "prop-types";

export const IsEditorContext = createContext({});

export function IsEditorProvider({ children }) {
    const [isEditor, setIsEditor] = useState(false);

    return <IsEditorContext.Provider value={{ isEditor, setIsEditor }}>{children}</IsEditorContext.Provider>;
}

IsEditorProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useIsEditorContext = () => useContext(IsEditorContext);
