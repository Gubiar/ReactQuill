/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
// import ReactQuill, { Quill } from 'react-quill';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Ring } from "@uiball/loaders";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import parse from "html-react-parser";
import Modal from "./components/Modal";
import { useIsEditorContext } from "./context/IsEditor";
import { postData, url } from "./Utils";
import { useContentEditorContext } from "./context/ContentEditor";

export default function Editor({ idSelectedQuestion, content, title, idSelectedGroup }) {
    const { setIsEditor } = useIsEditorContext();
    const { setPageEditContent } = useContentEditorContext();
    const [valueEditor, setValueEditor] = useState(content ?? "");
    const [isLoading, setIsLoading] = useState(false); //Loading
    const [isLoadingButton, setIsLoadingButton] = useState(false); //Loading botao salvar
    const [modalOpen, setModalOpen] = useState(false);

    const [inputTitulo, setinputTitulo] = useState(title ?? ""); //Título da página de ajuda sendo criada
    const [grupos, setGrupos] = useState([]); //Lista de grupos existente (Vem da API)

    const [isNovoGrupo, setIsNovoGrupo] = useState(false); //Se é um novo cadastro de grupo ou se é a seleção de um grupo existente
    const [valueNovoGrupo, setValueNovoGrupo] = useState(""); //Caso for um novo Grupo de perguntas (Valor do Input)
    const [grupoSelecionado, setGrupoSelecionado] = useState(idSelectedGroup ?? -1); //Caso se for selecionado um grupo existente (value select - option)
    const [htmlString, setHtmlString] = useState("");
    const [modalConteudo, setModalConteudo] = useState("Página criada com sucesso!  ✅");
    const [isError, setIsError] = useState(false);

    function handleExit() {
        setPageEditContent({});
        setIsEditor(false);
    }

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        if (!isError) {
            setIsNovoGrupo(false);
            setValueNovoGrupo("");
            setGrupoSelecionado(-1);
            setinputTitulo("");
            setHtmlString("");
            setValueEditor("");
            handleExit();
            window.location.reload(false);
        }
        setModalOpen(false);
    };


    const formats = ["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"];
    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image", "video"],
            ["clean"],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    };

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const response = await fetch(`${url}ajuda/getPerguntas.json?tipo=0`);
            const body = await response.json();
            setGrupos(body["faq"]);
            setIsLoading(false);
        }
        fetchData(); // No need for the setTimeout delay
    }, []);

    // onChange expects a function with these 4 arguments
    function handleChange(content, delta, source, editor) {
        setValueEditor(editor.getContents()); //JSON do Quill
        var converter = new QuillDeltaToHtmlConverter(editor.getContents().ops, {});
        setHtmlString(converter.convert());
    }

    const handleExportJSON = async () => {
        if (inputTitulo.length <= 0) {
            setModalConteudo("O título da página é obrigatório");
            setIsError(true);
            openModal();
        } else if (
            valueEditor.length <= 0 ||
            JSON.stringify(valueEditor) == JSON.stringify({ ops: [{ insert: "\n" }] }) ||
            JSON.stringify(valueEditor) == JSON.stringify({})
        ) {
            setModalConteudo("O conteúdo da página é obrigatório");
            setIsError(true);
            openModal();
        } else {
            setIsLoadingButton(true);
            var idGrupo = -1;

            if (valueNovoGrupo.length > 0) {
                const { id } = await postData(`${url}ajuda/postGrupo.json`, {
                    descricao: valueNovoGrupo,
                });
                idGrupo = id;
            } else {
                idGrupo = grupoSelecionado;
            }

            //Post Pergunta (Se tiver ID, é um update);
            // id e grupo_id opcionais
            await postData(`${url}ajuda/postPergunta.json`, {
                grupo_id: idGrupo == -1 ? null : idGrupo,
                id: idSelectedQuestion ?? undefined,
                descricao: inputTitulo,
                resposta: valueEditor,
            });

            const response = await fetch(`${url}ajuda/getPerguntas.json?tipo=0`);
            const body = await response.json();
            setGrupos(body["faq"]); //Atualizo a lista de grupo
            setIsLoadingButton(false);
            setModalConteudo("Página criada com sucesso!   ✅");
            setIsError(false);
            openModal();
        }
    };

    function hendleChangeSelectOption(e) {
        setGrupoSelecionado(e.target.value);
    }

    function handleChangeGrupo() {
        setIsNovoGrupo(!isNovoGrupo);
        setGrupoSelecionado(-1);
        setValueNovoGrupo("");
    }

    return (
        <>
            {isLoading ? (
                <div className="loadingContainer">
                    <Ring size={40} lineWeight={5} speed={2} color="#1b1e21" />
                </div>
            ) : (
                <>
                    <Modal isOpen={modalOpen} onClose={closeModal} conteudo={modalConteudo} />
                    <header className="header">
                        <button onClick={() => handleExit()}>Cancelar</button>
                        <button onClick={() => handleExportJSON()}>
                            {isLoadingButton ? <Ring size={20} lineWeight={3} speed={2} color="#FFF" /> : "Salvar"}
                        </button>
                    </header>
                    <main id="main">
                        <div className="editorContainer">
                            <div className="grupoContainer">
                                <header>
                                    <span>
                                        A página pertence à algum grupo?
                                        {isNovoGrupo ? (
                                            <button className="btnNovoGrupo" onClick={handleChangeGrupo}>
                                                Voltar para listagem de grupos
                                            </button>
                                        ) : (
                                            <button className="btnNovoGrupo" onClick={handleChangeGrupo}>
                                                Criar novo grupo
                                            </button>
                                        )}
                                    </span>
                                </header>
                                {isNovoGrupo ? (
                                    <input
                                        id="grupo"
                                        name="grupo"
                                        placeholder="Nome do novo grupo"
                                        value={valueNovoGrupo}
                                        onChange={(e) => {
                                            setValueNovoGrupo(e.currentTarget.value);
                                        }}
                                    />
                                ) : (
                                    <select value={grupoSelecionado} onChange={hendleChangeSelectOption}>
                                        <option value={-1}>Não pertence a nenhum grupo</option>
                                        {grupos.map((item, index) => (
                                            <option key={index} value={item["ajug_codigo"]}>
                                                {item["label"]}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <label className="titulo" htmlFor="titulo">
                                <span>Título da página</span>
                                <input
                                    id="titulo"
                                    name="titulo"
                                    placeholder="Título"
                                    value={inputTitulo}
                                    required
                                    onChange={(e) => {
                                        setinputTitulo(e.currentTarget.value);
                                    }}
                                />
                            </label>
                            <ReactQuill
                                theme={"snow"}
                                value={valueEditor}
                                onChange={handleChange}
                                modules={modules}
                                formats={formats}
                                bounds={".app"}
                                placeholder={"Edite aqui"}
                            />
                        </div>
                        <div className="previewContainer">
                            {htmlString.length <= 0 && <h3>Resultado final (Preview)</h3>}
                            <div>{htmlString && htmlString.length > 0 && parse(htmlString)}</div>
                        </div>
                    </main>
                </>
            )}
        </>
    );
}
