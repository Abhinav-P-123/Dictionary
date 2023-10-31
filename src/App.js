import './App.css';
import { useState } from 'react';

function App() {
  let [keywordEntered, setKeywordEntered] = useState(false);
  let [timescalled, settimescalled] = useState(false)
  let [audio, setAudio] = useState(`null`)
  let [keyword, setKeyword] = useState(0);
  let [greekWord, setGreekWord] = useState(`null`)
  let [meaningsHTML, setMeaningsHTML] = useState([]);
  let [error, setError] = useState(false)
  function handleSubmit(e) {
    if (e.keyCode == 13) {
      async function APIreq() {
        let response = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${document.getElementById('word-input').value}`);
        let data = (await response).json();

        return data;
      }

      APIreq().then(data => {
        if (data.length > 0) {
          setError(false)
          setKeywordEntered(true)
          settimescalled(timescalled + 1)
          setKeyword(`${data[0].word}`);
          if (data[0].phonetics.length >= 1) {
            for (let x = 0; x < data[0].phonetics.length; x++) {
              if (Object.keys(data[0].phonetics[x]).includes("audio") && (data[0].phonetics[x].audio !== "")) {
                setAudio(`${data[0].phonetics[x].audio}`)
                break;
              }
            }
          } else if (!(data[0].phonetics.length > 0)) {
            setAudio(`null`)
          } else if (data[0].phonetics.length >= 1 || audio == `null`) {
            setAudio("`null")
          }
          if (!Object.keys(data[0]).includes("phonetic")) {
            setGreekWord(`null`)
          } else if (Object.keys(data[0]).includes("phonetic")) {
            setGreekWord(data[0].phonetic);
          }
          let tempHTML = []
          for (let y = 0; y < data[0].meanings.length; y++) {
            tempHTML.push({
              partOfSpeech: `${data[0].meanings[y].partOfSpeech}`,
              definitions: data[0].meanings[y].definitions,
              synonyms: data[0].meanings[y].synonyms,
              antonyms: data[0].meanings[y].antonyms
            })
          }
          setMeaningsHTML(tempHTML)
        } else if (data.length == undefined) {
          setError(true)
        }
      })
    }
  }
  if (keywordEntered) {
    if (!error) {
      const elements = meaningsHTML.map((item, index) => {
        return (
          <div key={index}>
            <div className='meaningsSectionHeader'>
              {item.partOfSpeech}
            </div>
            <div className="definitions">
              <h1 style={{ fontSize: "clamp(16px,3vw,20px)", color: "#ffffff90", fontWeight: "200" }}>Meaning</h1>
              <ul className='meanings-list'>
                {item.definitions.map(item => {
                  if (Object.keys(item).includes("example")) {
                    return (
                      <div style={{ marginBottom: "0.4rem" }}>
                        <li><p className='definition-statement'>{item.definition}</p></li>
                        <p className='definition-example'>"{item.example}"</p>
                      </div>
                    )
                  } else {
                    return (
                      <div style={{ marginBottom: "0.4rem" }}>
                        <li><p className='definition-statement'>{item.definition}</p></li>
                      </div>
                    )
                  }
                })}
              </ul>
              {(item.synonyms.length > 0) ? <div className='synonyms'>
                <p className="synonym-heading">Synonyms</p>
                <div className="synonym-wordgroup">
                  {item.synonyms.map((item, index) => (
                    <p className='synonym-word'>{item}</p>
                  ))}
                </div>
              </div> : null}
              {(item.antonyms.length > 0) ? <div className='antonyms'>
                <p className="antonyms-heading">Aynonyms</p>
                <div className="antonyms-wordgroup">
                  {item.antonyms.map((item, index) => (
                    <p className='antonyms-word'>{item}</p>
                  ))}
                </div>
              </div> : null}
            </div>
          </div>)
      })
      return (
        <div className="App">
          <input type='text' id='word-input' className='word-input' onKeyUp={handleSubmit} placeholder='Search' />
          <div className='display'>
            <section className="one">
              <div className="part1">
                <h1>{keyword[0].toUpperCase() + keyword.slice(1,)} </h1>
                {!(greekWord == `null`) ? <p className='greekWord'>{greekWord}</p> : <p className='greekWord' style={{ display: "none" }}></p>}
              </div>
              {!(audio == `null`) ? <button onClick={function () {
                let newAudio = new Audio(`${audio}`);
                newAudio.play()
              }}
                className='playAudioBtn'
              ><svg width="32" height="32" viewBox="0 0 32 32" className='playSVG'>
                  <path d="M6 4l20 12-20 12z"></path>
                </svg></button>
                :
                null
              }
            </section>
            <section className="meanings">
              {elements}
            </section>
          </div>
        </div >
      );
    } else {
      return (<div className="App">
        <input type='text' id='word-input' className='word-input' onKeyUp={handleSubmit} placeholder='Search' />
        <div className="errordisplay">
          <h1 className="errortitle">No Definitions Found</h1>
          <p className='errormessage'>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
        </div>
      </div>)
    }
  } else if (!keywordEntered) {
    return (
      <div className="App">
        <input type='text' id='word-input' className='word-input' onKeyUp={handleSubmit} placeholder='Search' />
      </div >
    );
  }
}

export default App;
