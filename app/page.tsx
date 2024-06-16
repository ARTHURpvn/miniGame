'use client';
import React, {useState, useEffect, useRef} from 'react';

export default function home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [randomKey, setRandomKey]     = useState([]);
  const [arrayKeys, setArrayKeys]     = useState([])

  const [numWin, setNumWin] = useState(0)
  const [challengeMode, setChallengeMode] = useState(false);
  const [score, setScore] = useState(0);
  
  const [arrayScore, setArrayScore] = useState([]);
  const [scoreOrganized, setScoreOrganized] = useState(false);

  const [time, setTime]   = useState(100);
  const [loose, setLoose] = useState(false);
  const [win, setWin]     = useState(false);
  
  const divGame    = useRef(null);

  const spanArray    = useRef([]);
  const setSpanArray = (el, index) => {
    spanArray.current[index] = el;
  }

  // Variavel para criar as Letras e Numeros aleatorios
  const alf = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  function resetSpanColors() {
    spanArray.current.forEach(span => {
      if (span) {
        span.style.backgroundColor = '#6b6291'
      }
    });
  }


  function startGame() {
    let selecionadas = [];
    for (let i = 0; i < 6; i++) {

      // Randomiza a seleção das teclas
      const randonIndex = Math.floor(Math.random() * alf.length);
      selecionadas.push(alf.charAt(randonIndex));
    }    

    // Verifica se esta no modo desafio
    if (challengeMode && numWin == 0) {
      setTime(100);

    } else if (!challengeMode || time == 0) {
      setTime(100);
      
    } else {
      if (time < 80 && time > 0) {
        setTime(time + 20);
      }
    }

    setRandomKey(selecionadas);
    setGameStarted(true);
    setLoose(false);
    setWin(false);
    setArrayKeys([]);
    resetSpanColors();
    setScoreOrganized(false);
  }


  // Reinicia o Jogo
  function restartGame(){    
    if (challengeMode && !win && !loose) {
      setTime((prevTime) => prevTime + 20);

    } else {
      setScore(0);
      setTime(100);
    }

    if (divGame.current) {
      divGame.current.style.display = "flex";
    }
    startGame();
  }


  function normalGame() {
    startGame();
    setChallengeMode(false);
  }


  function challengeGame() {
    startGame();
    setNumWin(0)
    setChallengeMode(true)
  }


  // Funcao de voltar a tela inicial
  function backInitial() {
    setLoose(false);
    setWin(false);
    setGameStarted(false);
  }


  function updateGame() {
    if (divGame.current) {
      divGame.current.style.display = "none";
    }
  }

  function organizeScore() {
    arrayScore.push(score);
    arrayScore.sort((a, b) => b - a);
  }

  // Define um timer e Salva o tempo 
  useEffect(() => {
    let interval;

    if (gameStarted && time > 0 && !win) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 50);

    } else if (time === 0 && !scoreOrganized) {
      clearInterval(interval);

      // Verifica se esta no modo desafio com alguma vitoria para mandar pra tela certa
      if(challengeMode && numWin > 0 ) {
        setWin(true);
        organizeScore();
        setScoreOrganized(true);
      } 

      updateGame()
    }

    return () => clearInterval(interval);
  }, [gameStarted, time, win, numWin, scoreOrganized, challengeMode]);


  // Verificação da tecla apertada e a Aleatoria
  useEffect(() => {
    function keyPressed(event) {
      const pressedKey = event.key.toUpperCase();
      let allCorrect = true
      
      if (alf.includes(pressedKey)) {
        arrayKeys.push(pressedKey);

        for (let i = 0; i < arrayKeys.length; i++) {
          const spanKey = spanArray.current[i];

          if (arrayKeys[i] === randomKey[i]) {
            if (spanKey) {
              spanKey.style.backgroundColor = "#431deb";
            } 
        
          } else {
            allCorrect = false;
            break
          }
        }

        // Verificação e Add score
        if (arrayKeys.length === 6 && allCorrect) {
          if(challengeMode) {
            setNumWin(numWin + 1);
            const _score = (numWin * 2) + (time * 5);
            setScore(score + _score);

            setScoreOrganized(false);
            restartGame();

          } else {
            setWin(true);
            setScoreOrganized(false);
            updateGame();
          }

        // Quando apertar tecla errada manda pra tela de vitoria (se tiver alguma vitoria)
        } else if (!allCorrect) {
          if(numWin > 0) {
            setWin(true);
            setScoreOrganized(true);
            organizeScore();

          } else {
            setLoose(true);
          }

          setTime(0);
          setLoose(true);
          updateGame();
        }
      }
    }
    
    if (gameStarted && !win && !loose) {
      window.addEventListener('keydown', keyPressed);
    }

    return() => {
      window.removeEventListener('keydown', keyPressed);
    }
  }, [gameStarted, randomKey, win, loose, challengeMode, numWin, scoreOrganized, arrayKeys]);


  return (
    <main>

      {!gameStarted ? (
        <div>
          <div className='card text-white'>
            <div id="title" className='text-4xl font-bold absolute top-10'>
              <h1 className='text-white'> MINI-GAME </h1>
            </div>
            <div className='flex flex-col gap-2 absolute bottom-10'>
              <button onClick={normalGame} className='text-xl bg-blue-700 px-10 py-2 bottom-10 rounded-md'> INICIAR </button>
              <button onClick={challengeGame} className='text-xl bg-gray-700 px-10 py-2 bottom-10 rounded-md'> DESAFIO </button>
            </div>
          </div>

          {numWin != 0 ? (
            <div className='card-rank text-white flex justify-center text-center'>
            <div id="title" className='text-4xl font-bold absolute top-5'>
              <h1 className='text-white'> RANKING </h1>
            </div>

            <div className='gap-4 divide-y divide-y-reverse absolute top-20 divide-slate-400'>
              <div className='grid grid-cols-2 gap-10 mb-6'>
                <h3 className='w-10 font-bold'> Posição </h3>
                <h3 className='w-24 font-bold text-left'> Pontos </h3>
              </div>
              
              {arrayScore.map((key, index) => (
                <div className='grid grid-cols-2 '>
                  <p className='w-10'>{index + 1}</p>
                  <p className='w-26'>{key} Pontos</p>
                </div>
              ))}
            </div>
          </div>
          ) : null}
        </div>
      ) : null} 
      

      {gameStarted ? (
        <div ref={divGame} className='card text-white'>
          <div id="title" className='text-4xl font-bold absolute top-10'>
            <h1 className='text-white'> MINI-GAME </h1>
          </div>

          <p className='text-sm'> Aperte a tecla que esta aparecendo </p>

          <div id='key-card' className='text-4xl'>
            {randomKey.map((key, index) =>(
              <span key={index} ref={el => setSpanArray(el, index)} className={`key transition ease-in-out duration-200`}> {key} </span>
            ))}
          </div>

          {!challengeMode ? (
          <div>
            <button onClick={restartGame} className='text-xl bg-blue-700 px-8 py-1 absolute bottom-10 right-40 rounded-md'> REINICIAR </button>
          </div>
          ): null}

          <div id="time">
            <span id="remaining" className='transition ease-out' style={{width: `${time}%` }}></span>
          </div>
        </div>
      ) : null}


      {win && !challengeMode? (
        <div className='card text-white'>
          <div id="title" className='text-4xl font-bold absolute top-10'>
            <h1 className='text-white'> MINI-GAME </h1>
          </div>

          <p> Sucesso! </p>

          <div className='flex gap-4 absolute bottom-10'>
            <button onClick={backInitial} className='text-xl bg-gray-700 px-8 py-1 rounded-md'> Voltar </button>
            <button onClick={restartGame} className='text-xl bg-blue-700 px-8 py-1 rounded-md'> Jogar Novamente </button>
          </div>
        </div>
      ) : null}


      {loose && !win ? (
        <div className='card text-white'>
          <div id="title" className='text-4xl font-bold absolute top-10'>
            <h1 className='text-white'> MINI-GAME </h1>
          </div>

          <p className='text-white text-sm'> Você falhou </p>

          <div className='flex gap-4 absolute bottom-10'>
          <button onClick={backInitial} className='text-xl bg-gray-700 px-8 py-1 rounded-md'> Voltar </button>
          <button onClick={restartGame} className='text-xl bg-blue-700 px-8 py-1 rounded-md'> Tente Novamente </button>
          </div>
        </div>
      ) : null}


      {win && challengeMode ? (
        <div>
          <div className='card text-white'>
            <div id="title" className='text-4xl font-bold absolute top-10'>
              <h1 className='text-white'> MINI-GAME </h1>
            </div>

            <p> Parabens, voce conseguiu  {score} pontos </p>

            <div className='flex gap-4 absolute bottom-10'>
              <button onClick={backInitial} className='text-xl bg-gray-700 px-8 py-1 rounded-md'> Voltar </button>
              <button onClick={restartGame} className='text-xl bg-blue-700 px-8 py-1 rounded-md'> Jogar Novamente </button>
            </div>
          </div>

          <div className='card-rank text-white flex justify-center text-center'>
            <div id="title" className='text-4xl font-bold absolute top-5'>
              <h1 className='text-white'> RANKING </h1>
            </div>

            <div className='gap-4 divide-y divide-y-reverse absolute top-20 divide-slate-400'>
              <div className='grid grid-cols-2 gap-10 mb-6'>
                <h3 className='w-10 font-bold'> Posição </h3>
                <h3 className='w-24 font-bold text-left'> Pontos </h3>
              </div>
              
              {arrayScore.map((key, index) => (
                <div className='grid grid-cols-2 '>
                  <p className='w-10'>{index + 1}</p>
                  <p className='w-26'>{key} Pontos</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}