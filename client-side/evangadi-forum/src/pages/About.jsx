import React from "react";

import classs from "./style/about.module.css";
import Layout from "../components/Layout/Layout";
function About() {
  return (
    <section className={classs.about}>
      <h2 className={classs.title}>About</h2>
      <br />
      <h2 className={classs.header}>Evangadi Networks Q&A</h2>

      <p className={classs.paragraph}>
        No matter what stage of life you are in, whether you are just starting
        elementary school or being promoted to CEO of a Fortune 500 company, you
        have much to offer to those who are trying to follow in your footsteps.
      </p>

      <p className={classs.paragraph}>
        Whether you are willing to share your knowledge or you are just looking
        to meet mentors, please start by joining our network here.
      </p>
      <br />
      <button className={classs.button}>How it works</button>
    </section>
  );
}

export default About;
