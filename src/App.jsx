import { useEffect, useState } from "react";
import Editor from "./Editor";
import "animate.css";
import { useIsEditorContext } from "./context/IsEditor";
import Modal from "./components/Modal";
import { postData, url } from "./Utils";
import { Ring } from "@uiball/loaders";
import { useContentEditorContext } from "./context/ContentEditor";

export default function App() {
    const { isEditor, setIsEditor } = useIsEditorContext();
    const [perguntas, setPerguntas] = useState({});
    const [selectedIndexMenu, setSelectedIndexMenu] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { pageEditContent, setPageEditContent } = useContentEditorContext();

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    function handleSetContent(item) {
        if (!item["ajup_codigo"]) {
            if (selectedIndexMenu == item["index"]) {
                setSelectedIndexMenu(-1);
            } else {
                setSelectedIndexMenu(item["index"]);
            }
        }
    }

    async function handleSetIsEditor(id) {
        console.log(id);

        setIsLoading(true);
        const res = await fetch(`${url}ajuda/getResposta.json?id=${id}`);
        const data = await res.json();

        console.log(data);

        setPageEditContent({
            id: data.ajup_codigo,
            id_grupo: data.ajug_codigo,
            content: data.ajup_resposta,
            title: data.ajup_descricao,
        });
        setIsLoading(false);
        setIsEditor(true);
    }

    function handleOpenModal(content) {
        setModalContent(content);
        openModal(true);
    }

    function getContentModalExcluirGrupo(ajug_codigo) {
        async function handleExcluirGrupo() {
            const body = {
                id: ajug_codigo,
                isDelete: true,
            };
            const retorno = await postData(`${url}ajuda/postGrupo.json`, body);
            console.log(retorno);
            closeModal();
            window.location.reload(false);
        }

        return (
            <div className="containerExcluir">
                <h4>Deseja realmente excluir o grupo? Todas as páginas dele serão mantidas, apenas sendo removidas do grupo.</h4>
                <div className="btnContainer">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={handleExcluirGrupo}>Excluir</button>
                </div>
            </div>
        );
    }

    function getContentModalEditarGrupo(ajug_codigo) {
        var desc = "";

        const handleSetDesc = (e) => {
            e.preventDefault();
            desc = e.target.value;
        };

        async function handleEditarGrupo() {
            const body = {
                id: ajug_codigo,
                descricao: desc,
            };
            if (desc.length == 0) {
                window.alert("Digite um nome válido");
            } else {
                // console.log(body)
                const retorno = await postData(`${url}ajuda/postGrupo.json`, body);
                console.log(retorno);
                closeModal();
                window.location.reload(false);
            }
        }

        return (
            <div className="containerExcluir">
                <h4>Grupo - Edição</h4>
                <label htmlFor="editarGrupo">
                    <input name="editarGrupo" id="editarGrupo" onChange={(e) => handleSetDesc(e)} required placeholder="Digite o novo nome" />
                </label>
                <div className="btnContainer">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={handleEditarGrupo}>Salvar</button>
                </div>
            </div>
        );
    }

    function getContentModalExcluirPergunta(ajup_codigo) {
        async function handleExcluirPergunta() {
            const body = {
                id: ajup_codigo,
                isDelete: true,
            };
            const retorno = await postData(`${url}ajuda/postPergunta.json`, body);
            console.log(retorno);
            closeModal();
            window.location.reload(false);
        }

        return (
            <div className="containerExcluir">
                <h4>Deseja realmente excluir essa página? Essa ação não pode ser desfeita.</h4>
                <div className="btnContainer">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={handleExcluirPergunta}>Excluir</button>
                </div>
            </div>
        );
    }

    function handleNewPage() {
        setPageEditContent({});
        setIsEditor(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${url}ajuda/getPerguntas.json`);
                const perguntasData = await res.json();
                setPerguntas(perguntasData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    function icnArrowForward() {
        return (
            <svg width="15" height="20" viewBox="0 0 57 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54 20H3.00011" stroke="#1b1e21" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M37.0001 36.9999L54 20L37.0001 3" stroke="#1b1e21" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    function iconArrowDown() {
        return (
            <svg width="19" height="30" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L8.77046 9.22183C9.16554 9.64324 9.83446 9.64324 10.2295 9.22183L17 2" stroke="black" strokeWidth="3" strokeLinecap="round" />
            </svg>
        );
    }

    return (
        <>
            {isLoading ? (
                <div className="loadingContainer">
                    <Ring size={40} lineWeight={5} speed={2} color="#1b1e21" />
                </div>
            ) : (
                <>
                    <Modal isOpen={modalOpen} onClose={closeModal} conteudo={modalContent} />
                    {!isEditor && (
                        <>
                            <header className="headerApp">
                                <a href="https://cliente.goplataforma.com.br/">Sair do Painel</a>
                                <button onClick={handleNewPage}>Nova Página de ajuda</button>
                            </header>
                            <main className="mainApp">
                                <h3>Páginas e grupo de páginas criados</h3>
                                <div className="lista">
                                    <ul>
                                        {perguntas["faq"] &&
                                            perguntas["faq"].map((item, index) => {
                                                item["index"] = index;
                                                // console.log(item);
                                                return (
                                                    <>
                                                        <li key={index}>
                                                            <button onClick={() => handleSetContent(item)}>
                                                                <span>{item["label"]}</span>
                                                                {item["ajug_codigo"] ? (
                                                                    <div>
                                                                        <p
                                                                            onClick={() => handleOpenModal(getContentModalExcluirGrupo(item["ajug_codigo"]))}
                                                                            className="btn_excluir"
                                                                        >
                                                                            Excluir
                                                                        </p>
                                                                        <p
                                                                            onClick={() => handleOpenModal(getContentModalEditarGrupo(item["ajug_codigo"]))}
                                                                            className="btn_editar"
                                                                        >
                                                                            Editar
                                                                        </p>

                                                                        {iconArrowDown()}
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <p
                                                                            onClick={() => handleOpenModal(getContentModalExcluirPergunta(item["ajup_codigo"]))}
                                                                            className="btn_excluir"
                                                                        >
                                                                            Excluir
                                                                        </p>
                                                                        <p onClick={() => handleSetIsEditor(item["ajup_codigo"])} className="btn_editar">
                                                                            Editar
                                                                        </p>
                                                                        {icnArrowForward()}
                                                                    </div>
                                                                )}
                                                            </button>
                                                            {selectedIndexMenu == item["index"] && item["itens"] && (
                                                                <ul className={`animate__animated animate__fadeIn animate__faster sub_menu`}>
                                                                    {item["itens"].map((item, index) => (
                                                                        <li key={index}>
                                                                            <button onClick={() => handleSetContent(item)}>
                                                                                <span>{item["label"]}</span>
                                                                                <div>
                                                                                    <p
                                                                                        onClick={() =>
                                                                                            handleOpenModal(getContentModalExcluirPergunta(item["ajup_codigo"]))
                                                                                        }
                                                                                        className="btn_excluir"
                                                                                    >
                                                                                        Excluir
                                                                                    </p>
                                                                                    <p
                                                                                        onClick={() => handleSetIsEditor(item["ajup_codigo"])}
                                                                                        className="btn_editar"
                                                                                    >
                                                                                        Editar
                                                                                    </p>
                                                                                    {icnArrowForward()}
                                                                                </div>
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    </>
                                                );
                                            })}
                                    </ul>
                                </div>
                            </main>
                        </>
                    )}

                    {isEditor && (
                        <Editor
                            idSelectedQuestion={pageEditContent.id ?? undefined}
                            content={pageEditContent.content ?? undefined}
                            title={pageEditContent.title ?? undefined}
                            idSelectedGroup={pageEditContent.id_grupo ?? undefined}
                        />
                    )}
                </>
            )}
        </>
    );
}
