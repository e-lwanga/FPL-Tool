import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomeRoute from './routes/home';
import AnalyserRoute from './routes/analyser';

const router=createBrowserRouter([
  {
    path:"/",
    element:<HomeRoute/>
  },
  {
    path:"/:managerId",
    element:<AnalyserRoute/>
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
);

export function getServerAddress(){
    //server address returned doesn't contain a trailing /
    const protocol="http:";
    // const protocol="https:";
    const hostname="10.42.0.15";
    // const hostname="fpltool.com";
    const port=80;
    // const port=null;
    return `${protocol}//${hostname}${port? `:${port}`:``}`;
}