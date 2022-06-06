interface StreamlitLoaderProps {
    src: string;
    title: string
}

const StreamlitLoader: React.FC<StreamlitLoaderProps> = ({ src, title }) => (
    <iframe src={src} title={title} width="100%" height="99%" frameBorder={0} />
)

export default StreamlitLoader;
