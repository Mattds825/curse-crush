import React from "react";

interface PoemModalProps {
  setShowPoemModal:React.Dispatch<React.SetStateAction<boolean>>;
}

const PoemModal:React.FC<PoemModalProps> = (props) => {
  const { setShowPoemModal } = props;


  return (
    <div className="poemModal">
      <h1>Poem</h1>
      <p>
        In the darkest night, where wisdom owls soar,
        <br />
        A creature whispers secrets, but tell me, what Fo(u)r?.
        <br />
        When the sky reveals a guiding star,
        <br />
        Its sparkle whispers softly three wishes afar.
        <br />
        On cliffs where the horned one stands with might,
        <br />
        Face it with courage, again, again, again, again, and again you fight.
        <br />
        In shadows deep, where beetles crawl,
        <br />
        Two hushed steps, then the shattering fall.
        <br />
        A single eye sees all that’s true,
        <br />
        It blinks, it stares thrice it glares
        <br />
        And at the end, a key for the locks,
        <br />
        One strike alone the door unlocks…
      </p>
      <button onClick={()=>{  
        // fade out the modal
        document.querySelector(".poemModal")?.classList.add("fadeOut");
        // hide the modal after 
        setTimeout(() => {
          setShowPoemModal(false);
        }, 500);        
      }}>Back</button>
    </div>
  );
};

export default PoemModal;
