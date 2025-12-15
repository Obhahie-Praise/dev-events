'use client';

import { ArrowDown, ChevronDown } from "lucide-react";
import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => {console.log('Tesitng client side type shiii!!!')}}>
        <a href="" className="">Explore Events
            <ArrowDown className="inline-block ml-2 mb-1" size={24} />
        </a>
    </button>
  )
}

export default ExploreBtn