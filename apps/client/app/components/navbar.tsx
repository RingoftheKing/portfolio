import Link from "next/link";

import React from "react";

const Navbar = () => {
  return <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
          <Link href="/"><div className="btn btn-ghost text-xl">Sakana</div></Link>
      </div>
      <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/skills">Skills</Link></li>
              <li>
                  <details>
                      <summary>Others</summary>
                      <ul className="bg-base-100 rounded-t-none p-2">
                          <li><Link href="/contact">Contact</Link></li>
                      </ul>
                  </details>
              </li>
          </ul>
      </div>
  </div>
}

export default Navbar;
