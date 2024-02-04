import styles from './index.module.css'

const particles: ParticleStyle[] = [
  { '--a': '-45deg', '--x': '53%', '--y': '15%', '--d': '4em', '--f': '.7', '--t': '.15' },
  { '--a': '150deg', '--x': '40%', '--y': '70%', '--d': '7.5em', '--f': '.8', '--t': '.08' },
  { '--a': '10deg', '--x': '90%', '--y': '65%', '--d': '7em', '--f': '.6', '--t': '.25' },
  { '--a': '-120deg', '--x': '15%', '--y': '10%', '--d': '4em' },
  { '--a': '-175deg', '--x': '10%', '--y': '25%', '--d': '5.25em', '--f': '.6', '--t': '.32' },
  { '--a': '-18deg', '--x': '80%', '--y': '25%', '--d': '4.75em', '--f': '.5', '--t': '.4' },
  { '--a': '-160deg', '--x': '30%', '--y': '5%', '--d': '9em', '--f': '.9', '--t': '.5' },
  { '--a': '175deg', '--x': '9%', '--y': '30%', '--d': '6em', '--f': '.95', '--t': '.6' },
  { '--a': '-10deg', '--x': '89%', '--y': '25%', '--d': '4.5em', '--f': '.55', '--t': '.67' },
  { '--a': '-140deg', '--x': '40%', '--y': '10%', '--d': '5em', '--f': '.85', '--t': '.75' },
  { '--a': '90deg', '--x': '45%', '--y': '65%', '--d': '4em', '--f': '.5', '--t': '.83' },
  { '--a': '30deg', '--x': '70%', '--y': '80%', '--d': '6.5em', '--f': '.75', '--t': '.92' },
]

interface ParticleStyle {
  [key: string]: string
}
export default function Stopwatch({ time }: { time: string }) {
  return <>
    <div className={`${styles.block} relative px-20 py-5 rounded-full mx-auto text-4xl font-bold cursor-pointer`}>
      {time}
      <span className={styles.wrap} aria-hidden="true">
        {particles.map((particleStyle, index) => (
          <span key={index} className={styles.particle} style={particleStyle}></span>
        ))}
      </span>
    </div>
  </>
}