import { useEffect, useState } from "react";
import "./App.css";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import "altcha";
import type { } from "altcha/types/react";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import axios from "axios";
import galaxy from './assets/galaxy.jpg'
import galaxy2 from './assets/galaxy-2.jpg'
import galaxy3 from './assets/galaxy-3.jpg'
import "altcha/themes/aqua.css";
import { Presets, SplitFlap } from 'react-split-flap'
import { loginUser } from "./services/auth.service";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AppRoutes />
  )
}

export default App;