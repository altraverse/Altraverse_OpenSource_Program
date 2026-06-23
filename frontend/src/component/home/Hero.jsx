import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Hero() {

  const navigate = useNavigate();
  useEffect(() => {

    window.particlesJS.load('hero', '/partical.json', function() {
      console.log('callback - particles.js config loaded');
    });

    function createShootingStar() {
      const container = document.querySelector('.starContainer');
      if (!container) return;

      // 1. Calculate the exact angle based on viewport
      const radians = Math.atan(Math.min(window.innerHeight, window.innerWidth) / Math.max(window.innerWidth, window.innerHeight) * 2);
      const deg = radians * (180 / Math.PI);

      // 2. Generate a unique name for this star's custom animation path
      const animationName = `fly-diagonal-${Math.floor(Math.random() * 100000)}`;

      // 3. Create the CSS keyframes string inject dynamically
      // This bakes your calculated 'deg' directly into the transform steps
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
    @keyframes ${animationName} {
      0% {
        transform: rotate(${deg}deg) translateX(0) translateY(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: rotate(${deg}deg) translateX(120vw) ;
        opacity: 0;
      }
    }
  `;
      document.head.appendChild(styleSheet);

      // 4. Create and configure the star element
      const star = document.createElement('div');
      star.className = 'shooting-star';

      const startTop = Math.random() * 60;
      const startLeft = -(Math.random() * 10 + 5);
      const duration = Math.random() * 1 + 1.5; // Between 1.5s and 2.5s

      Object.assign(star.style, {
        top: `${startTop}%`,
        left: `${startLeft}%`,
        // Use the unique animation name we just injected above
        animation: `${animationName} ${duration}s linear forwards`
      });

      container.appendChild(star);

      // 5. Clean up BOTH the star and its custom style tag when done
      star.addEventListener('animationend', () => {
        star.remove();
        styleSheet.remove();
      });
    }
    // 2. Fix: Use a recursive setTimeout loop for truly dynamic random intervals
    function spawnLoop() {
      createShootingStar();

      // Generates a random delay between 1 and 11 seconds (based on your original Math.random() * 10000 + 1000)
      const nextDelay = Math.random() * 10000 + 1000;

      setTimeout(spawnLoop, nextDelay);
    }

    // Start the loop
    spawnLoop();
    // every 1 - 1.5 seconds
    // setInterval(() => {
    //   createShootingStar();
    // }, Math.random() * 10000 + 1000);


  }, []);


  return (
    <div id='hero' className=' bg-black h-screen w-full hero'>

      {/* moon */}
      <div className="absolute top-10 md:top-20 right-[10%] md:right-[15%] z-5 hidden sm:block">
        <div className="relative w-16 h-16 md:w-22 md:h-22">
          <div className="absolute inset-0 bg-blue-100/30 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-200 rounded-full shadow-lg" style={{ boxShadow: '0 0 30px rgba(191, 219, 254, 0.4)' }}>
            <div className="absolute top-4 left-5 w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full opacity-60"></div>
            <div className="absolute top-12 right-4 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full opacity-50"></div>
            <div className="absolute bottom-5 left-4 w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-300 rounded-full opacity-55"></div>
          </div>
        </div>
      </div>
      <img className='absolute z-4 bottom-0 left-0 w-full' src="/bg.png" alt="background" />

      {/* star container */}
      <div className="absolute inset-0 z-2 overflow-hidden starContainer"></div>

      <div className='w-full absolute z-4 h-full flex flex-col justify-center items-start p-6 md:p-16 lg:p-20 gap-4 md:gap-6'>
        <h2 className='text-3xl md:text-5xl lg:text-6xl font-bold text-white'>Code. Contribute.</h2>
        <h2 className='text-3xl md:text-5xl lg:text-6xl font-bold textGradient bg-clip-text text-transparent'>Create Impact.</h2>
        <p className='text-sm md:text-base lg:text-lg text-gray-200 max-w-2xl mt-2 md:mt-4'>ASOC is India's largest open source program, connecting developers with real-world projects to learn, build, and grow together.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-6'>
          <Button onClick={() => navigate('/projects')} className='buttonGradient w-full sm:w-auto'>
            Explore Projects
          </Button>
          <Button onClick={() => navigate('/community')} variant='ghost' className='border-1 hover:bg-white hover:text-black border-white text-white w-full sm:w-auto'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-brand-discord"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z" /></svg>
            Join Community
          </Button>
        </div>
      </div>
    </div>);

}
