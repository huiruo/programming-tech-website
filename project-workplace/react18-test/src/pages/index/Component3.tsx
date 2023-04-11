import { useNavigate } from 'react-router-dom';

function App(props: any) {
  let navigate = useNavigate();

  const onRouter = (type: string) => {
    console.log('onRouter')
    navigate(`${type}`)
  }

  return (
    <div className="container">
      <div>
        <button onClick={() => onRouter('redux')}>ReduxPage</button>
      </div>
    </div>
  );
}

export default App;