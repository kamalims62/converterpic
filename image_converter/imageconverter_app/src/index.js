import React from 'react';
import ImageConverter from "./components/App";
import { createRoot } from 'react-dom/client';


const root = document.getElementById('app');
const rootElement = createRoot(root);
rootElement.render(<ImageConverter />);