import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header>
      <nav className="">
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

          <p className="">DevEvent</p>
        </Link>
        <ul className="">
          <Link href="/">Home</Link>
          <Link href="">Events</Link>
          <Link href="">Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
