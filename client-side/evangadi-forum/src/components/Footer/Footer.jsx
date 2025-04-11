import React from "react";
import styles from "./Footer.module.css"; // Changed to module CSS import
import { LuFacebook } from "react-icons/lu";
import { PiInstagramLogoLight } from "react-icons/pi";
import { LiaYoutube } from "react-icons/lia";

import logo from "../../assets/image/evangadilogo.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLogo}>
        <div className={styles.logo}>
          <img src={logo} alt="Evngadi-Logo" />
        </div>
        <div className={styles.mediaLink}>
          <ul className={styles.mediaLinkList}>
            <li className={styles.mediaLinkItem}>
              <a href="http://">
                <LuFacebook size={20} />
              </a>
            </li>
            <li>
              <a href="http://">
                <PiInstagramLogoLight size={20} />
              </a>
            </li>
            <li>
              <a href="http://">
                <LiaYoutube size={20} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.usefulLinks}>
        <h3>Useful Links</h3>
        <ul>
          <li>
            <a href="#">How it works</a>
          </li>
          <li>
            <a href="#">Terms of Service</a>
          </li>
          <li>
            <a href="#">Privacy policy</a>
          </li>
        </ul>
      </div>
      <div className={styles.contactInformation}>
        <h3>Contact Info</h3>
        <p>Evangadi Networks</p>
        <p>support@evangadi.com</p>
        <p>+1-202-386-2702</p>
      </div>
    </footer>
  );
};

export default Footer;
