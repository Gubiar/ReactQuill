/* eslint-disable react/prop-types */
import ReactModal from "react-modal";

const customModalStyle = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
    },
    content: {
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "20px",
        minWidth: "400px",
        minHeight: "140px",
        width: "fit-content",
        height: "fit-content",
        maxHeight: "40vh",
        maxWidth: "70vw",
        margin: "auto",
        textAlign: "center",
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
};

const Modal = ({ isOpen, onClose, conteudo }) => {
    return (
        <ReactModal isOpen={isOpen} onRequestClose={onClose} style={customModalStyle}>
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    cursor: "pointer",
                    border: "0",
                    background: "transparent",
                    fontSize: "20px",
                    fontWeight: "700",
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512" id="close">
                    <path d="M437.5 386.6L306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z"></path>
                </svg>
            </button>
            <div>{conteudo}</div>
        </ReactModal>
    );
};

export default Modal;
