import DfaMaker from "./TDComponents/dfaMaker"
const App = () => {
  const styles = {
    border: {
      // border: '4px solid black',
      // zIndex: -1
    }
  }

  return (
    <div>
      <div style={styles.border}>
        <DfaMaker one={true}/>
      </div>
      <div style={styles.border}>
        <DfaMaker one={false}/>
      </div>
    </div>
  )
}

export default App