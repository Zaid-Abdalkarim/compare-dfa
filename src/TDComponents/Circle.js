function Circle(props) {
  const styles = {
    circle: {
      width: 75,
      height: 75,
      borderRadius: '50%',
      backgroundColor: props?.color ? props.color : '#bbb',
      display: 'inline-block',
      top: props?.locY,
      left: props?.locX,
      position: props?.locX ? 'absolute' : 'static',
      border: 'black',
      borderSize: 5
    },
    center: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: '-37.5 0 0 -37.5px' /* Apply negative top and left margins to truly center the element */
    }
  }

  return (
    <div style={styles.circle}>
      <div style={styles.center}></div>
      {
        props?.innerDetails &&
        props.innerDetails
      }
    </div>
  );
}

export default Circle;
