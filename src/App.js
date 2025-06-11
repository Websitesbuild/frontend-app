import React from 'react';
import PageRoute from './components/Routes';
import Footer from './components/Footer';
function App() {
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   // This is where you can add any side effects or data fetching
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/');
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const result = await response.json();
  //       setData(result);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }

  // , []);


  return (
    <div className="App">
      <PageRoute />
      <Footer />
    </div>
  );
}

export default App;
