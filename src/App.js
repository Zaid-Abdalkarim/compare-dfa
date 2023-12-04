import DfaMaker from "./TDComponents/dfaMaker"
const App = () => {
  const styles = {
    border: {
      border: '4px solid black',
    },
    horizontalLine: {
      height: 7, 
      backgroundColor: "black",
      position: 'absolute',
      top: '50%',
      width: '100%'
    },
    bottomDFA: {
      position: "absolute",
      bottom: 0,
      border: '4px solid black',
      width: '100%'
    }
  }

  return (
    <div>
      <div  style={styles.border}>
        <DfaMaker one={true}/>
      </div>
      <hr style={styles.horizontalLine}></hr>
      <div style={styles.bottomDFA}>
        <DfaMaker one={false}/>
      </div>
    </div>
  )
}

export default App