class LinkComponent extends React.Component{
    handleClick = (event) =>{
      event.preventDefault();
      console.log("Link clicked");
    }
  
    render() {
      const {block} = this.props;
      const text = block.getText();
      const entityKey = block.getEntityAt(0);
      const { url } = this.props.contentState.getEntity(entityKey).getData();
      return (
        <a href={url} onClick={this.handleClick}>
          {text}
        </a>
      );
    }
  }
  // BlockTypeとHTMLの対応関係
  const customBlockRenderer = (setEditorState) => (contentBlock, { getEditorState }) => {
    const blockType = contentBlock.getType();
  
    if (blockType === 'image-with-caption') {
      const src = contentBlock.getData().get('src');
      const alignment = contentBlock.getData().get('alignment') || 'start';
      
      return {
        component: ImageWithCaption,
        editable: false,
        props: {
          src,
          alignment,
          setEditorState,
        }
      }
    }
    //add 11-28
    if (blockType === "LINK"){
      return{
        component: LinkComponent,
        editable : false,
      };
    }
}