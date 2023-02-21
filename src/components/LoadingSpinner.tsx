type Props = {
    display:boolean,
  };
  
  export const spinnerReducer = (prevState:string[], caller: string) => {
    let lower = caller.toLocaleLowerCase();
    const index = prevState.indexOf(lower);
  
    if(index > -1) {
      return prevState.filter(s => s !== lower)
    }
    
    return [...prevState, lower]
     
  }
  
  const LoadingSpinner = (props: Props) => {
    return (
      <div className="spinner-container" hidden={!props.display}>
        <div className="loading-spinner"></div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  