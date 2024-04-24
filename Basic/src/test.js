import { useEffect, useRef } from 'react'
import Matter, { Engine, Render, Bodies, World, Mouse, MouseConstraint} from 'matter-js'
import './App.css';

function App (props){
  {/* Create World */}
  const scene = useRef();

  const isPressed = useRef(false);

  const engine = useRef(Engine.create({
    /* World gravity x, y, scale= 0.001(w) */
    gravity:{
      x: 0,
      y: 0.1,
      scale: 0.0005
    }}
  ));


  const mouse = useRef();

  useEffect(() => {
    const cw = document.body.clientWidth
    const ch = document.body.clientHeight

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent',
        showCollisions: false,
        showAngleIndicator: false,
      }
      
    });

    
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, {
        isStatic: true,
        collisionFilter: {
          group: -1,
        }
      
      }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(0, 0, 5, 10, { isStatic: true }),
      Bodies.rectangle(cw / 2,50,cw/2,10,{isStatic:true, angle: Math.PI * 0.1}),
      Bodies.rectangle(cw / 4,50,cw/2+600,10,{isStatic:true, angle: Math.PI * (-0.1)})
    ])

    Matter.Runner.run(engine.current)
    Render.run(render)

    return () => {
      Render.stop(render)
      render.canvas.remove()
    }
  }, [])


    // 마우스를 이용해 조작을 가능하게 해줍니다.
    const mouseControll = Matter.Mouse.create(Render.sce),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouseControll,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
        },
      },
    });


  const Gravity1 = () =>{
    engine.current.gravity.scale+=0.00001;
  }

  const Gravity2 = () =>{
    engine.current.gravity.scale-=0.00001;
  }

  const handleDown = () => {
    isPressed.current = true
  }

  const handleUp = () => {
    isPressed.current = false
  }

  const handleAddCircle = e => {
    if (isPressed.current) {
      const ball = Bodies.circle(
        e.clientX,
        e.clientY,
        1 + Math.random() * 10,
        {
          mass: 10,
          restitution: 0.9,
          friction: 0.005,
          render: {
            fillStyle: "rgb("+Math.random()*256+","+Math.random()*256+","+Math.random()*256+")"
          },
          frictionAir:0.001
        })

      World.add(engine.current.world, [ball])
    }
  }



  const root = document.body;
  const cursor = document.querySelector(".curzr-arrow-pointer");
  const position = {
    distanceX: 0, 
    distanceY: 0,
    distance: 0,
    pointerX: 0,
    pointerY: 0,
  };
    
  const previousPointerX = 0;
  const previousPointerY = 0;
  const angle = 0
  const previousAngle = 0;
  const angleDisplace = 0;
  const degrees = 57.296;
  const cursorSize = 20;

  const cursorStyle={
    boxSizing: 'border-box',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '2147483647',
    width: `${ cursorSize }px`,
    height: `${ cursorSize }px`,
    transition: '250ms, transform 100ms',
    userSelect: 'none',
    pointerEvents: 'none'
  };



  useEffect(()=>{
    window.addEventListener("mousemove", (e)=>{
      console.log("x값:"+e.clientX);
      console.log("y값:"+e.clientY);
      mouse.current.style.left=e.clientX+"px";
      mouse.current.style.top=e.clientY+"px";
    });

  })

  const move = (e) => {
    previousPointerX = e.position.pointerX;
    previousPointerY = position.pointerY
    position.pointerX = e.pageX + root.getBoundingClientRect().x
    position.pointerY = e.pageY + root.getBoundingClientRect().y
    position.distanceX = previousPointerX - position.pointerX
    position.distanceY = previousPointerY - position.pointerY
    const distance = Math.sqrt(position.distanceY ** 2 + position.distanceX ** 2)

    cursor.style.transform = `translate3d(${position.pointerX}px, ${position.pointerY}px, 0)`
 
    if (distance > 1) {
      this.rotate(position)
      } else {
      this.cursor.style.transform += ` rotate(${angleDisplace}deg)`
      }
  }

  


  
  return (
    <div className='App' onMouseDown={handleDown} onMouseUp={handleUp} onMouseMove={handleAddCircle} style={{border:"1px solid red", height:700 ,width:'100%'}} >
      <div className="curzr-arrow-pointer" ref={mouse}>
        <svg className="page-cursor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path className="inner" d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z" fill="#F2F5F8" />
            <path className="outer" d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z" fill="#111920" />
        </svg>
      </div>
      
      <div ref={scene} style={{ width: '100%', height: '100%'}} />
      <button onClick={Gravity1}>gravity plus</button>
      <button onClick={Gravity2}>gravRity minus</button>
    </div>
  )
}


export default App;
