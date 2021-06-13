import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'; 

const App = () => {
  const ref = useRef<any>();
  const [input, setInpur] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current= await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    })
  }

  useEffect(() => {
    startService();
  }, [])

  const onClick = async () => {
    if (!ref.current) return;
    
    // * transpile inputed code
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      }
    })

    setCode(result.outputFiles[0].text);
  }

  return <div>
    <textarea onChange={e => setInpur(e.target.value)} value={input}>
    </textarea>
    <div>
    <button onClick={onClick}>Submit</button>
    </div>
    <pre>{code}</pre>
  </div>
}

ReactDOM.render(<App />, document.querySelector('#root'))

