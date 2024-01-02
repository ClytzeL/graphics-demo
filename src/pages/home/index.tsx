import {useEffect,useRef,useState} from 'react'
import Stage from '../stage'
import './index.scss'
const Home : React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const [size, setSize] = useState([1,1]);
    const [isInit, setInit] = useState(false)

    useEffect(() => {
        if(canvasRef.current){
            const canvas = canvasRef.current;
            setSize([canvas.clientWidth, canvas.clientHeight]);
            setInit(true);
        }
    }, [])

    useEffect(() => {
        if(isInit){
            const canvas = canvasRef.current as HTMLCanvasElement;
            const stage = new Stage(canvas);
            stage.start();
        }
    }, [isInit])

    return <canvas className={"canvas"} ref={canvasRef} width={size[0]} height={size[1]} />
}

export default Home;