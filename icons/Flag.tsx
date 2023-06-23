export default function Flag() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='500' height='200'>
      <defs>
        <linearGradient id='waveGradient' gradientTransform="rotate(90)">
          <stop offset='0%' stopColor='#fffbeb' />
          <stop offset='50%' stopColor='#fcd34d'  stopOpacity="0.8"/>
          <stop offset='100%' stopColor='#ecfdf5' stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id='waveGradient2' gradientTransform="rotate(90)">
          <stop offset='0%' stopColor='orange' stopOpacity="0.6"/>
          <stop offset='100%' stopColor='#ecfdf5' stopOpacity="0.52"/>
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id='waveGradient3'cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25" gradientTransform="rotate(90)">
          <stop offset='0%' stopColor='#a7f3d0' stopOpacity="0.25"/>
          <stop offset='50%' stopColor='#d1fae5' stopOpacity="0.5"/>
          <stop offset='100%' stopColor='#f0fdfa'/>
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id='waveGradient4'>
          <stop offset='0%' stopColor='#dcfce7' stopOpacity="0" />
          <stop offset='100%' stopColor='#f7fee7' stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d='M0,100 C50,50 150,50 200,100 S350,150 400,100 S500,50 500,100 V200 H0 Z'
        fill='url(#waveGradient)'
      >
        <animate
          attributeName='d'
          attributeType='XML'
          repeatCount='indefinite'
          dur='12s'
          values='
          M0,100 C50,50 150,50 200,100 S350,150 400,100 S400,50 500,120 V200 H0 Z;
          M0,100 C50,80 150,80 220,80 S380,150 400,80 S500,100 500,180 V200 H0 Z;
          M0,100 C50,50 150,50 200,100 S350,150 400,100 S400,50 500,120 V200 H0 Z
                 '
        />
      </path>
      <path
        d='M0,150 C50,200 150,200 200,150 S350,100 400,150 S500,200 500,150 V200 H0 Z'
        fill='url(#waveGradient2)'
        transform="rotate(0 -30 80)
        translate(-86 100)
        skewX(40)
        scale(1 0.5)"
      >
        <animate
          attributeName='d'
          attributeType='XML'
          repeatCount='indefinite'
          dur='12s'
          values='
          M0,150 C50,200 150,200 200,150 S350,100 400,150 S500,200 500,150 V200 H0 Z;
          M0,150 C50,150 150,180 200,150 S350,150 400,150 S500,150 500,150 V200 H0 Z;
          M0,150 C50,200 150,200 200,150 S350,100 400,150 S500,200 500,150 V200 H0 Z
                 '
        />
      </path>
      <path
        d='M0,200 C100,100 160,80 200,106 C200,106 260,140 300,200 L200,200 Z'
        fill='url(#waveGradient3)'
      >
        <animate
          attributeName='d'
          attributeType='XML'
          repeatCount='indefinite'
          dur='12s'
          values='
          M0,200 C100,100 160,80 200,106 C200,106 260,140 300,200 L200,200 Z;
          M0,200 C90,80 140,90 200,110 C200,110 260,140 300,200 L200,200 Z;
          M0,200 C80,120 120,100 220,100 C220,100 290,160 300,200 L200,200 Z;
          M0,200 C80,120 120,100 220,100 C220,100 290,160 300,200 L200,200 Z;
          M0,200 C90,80 140,90 200,110 C200,110 260,140 300,200 L200,200 Z;
          M0,200 C100,100 160,80 200,106 C200,106 260,140 300,200 L200,200 Z
          '
        />
      </path>
      <path
        d='M0,150 C50,200 150,200 200,150 S350,100 400,150 S500,200 500,150 V200 H0 Z'
        fill='url(#waveGradient4)'
      >
        <animate
          attributeName='d'
          attributeType='XML'
          repeatCount='indefinite'
          dur='12s'
          values='
          M0,150 C50,200 150,200 200,150 S350,100 400,150 S500,200 500,150 V200 H0 Z;
          M0,150 C50,150 150,180 200,250 S350,150 400,120 S500,150 500,120 V200 H0 Z;
          M0,150 C50,200 150,200 200,150 S350,100 400,150 S500,200 500,150 V200 H0 Z'
        />
      </path>
    </svg>
  )
}