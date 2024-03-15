export   const frag = /*glsl*/`
//noise funtion abstract from https://www.shadertoy.com/view/ldc3RB
//RayMarch funtion abstract from https://www.shadertoy.com/view/WtGXDD

#define MAX_STEPS 200
#define MAX_DIST 100.
#define SURF_DIST .001
#define TAU 6.283185
#define PI 3.141592
#define S smoothstep

uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
vec2 hash22(vec2 p){
  p = vec2( dot(p,vec2(127.1,311.7)),
      dot(p,vec2(269.5,183.3)));
  
  //return normalize(-1.0 + 2.0 * fract(sin(p)*43758.5453123));
  return -1.0 + 2.0 * fract(sin(p)*43758.5453123);
}

float noise(vec2 p){
  const float K1 = 0.366025404; // (sqrt(3)-1)/2;
  const float K2 = 0.211324865; // (3-sqrt(3))/6;
  
  vec2 i = floor(p + (p.x + p.y) * K1);
  
  vec2 a = p - (i - (i.x + i.y) * K2);
  vec2 o = (a.x < a.y) ? vec2(0.0, 1.0) : vec2(1.0, 0.0);
  vec2 b = a - (o - K2);
  vec2 c = a - (1.0 - 2.0 * K2);
  
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
  
  return dot(vec3(70.0, 70.0, 70.0), n);
}

float noise_itself(vec2 p){
  float f = 0.;
  p *= 8.;
  f += 1.0000 * noise(p); p = 6.0 * p;
  f += 0.1000 * noise(p); p = 4.0 * p;
  f += 0.0100 * noise(p); p = 3.0 * p;
  //f += 0.001 * noise(p); 
  return f;
}

mat2 Rot(float a) {
  float s=sin(a), c=cos(a);
  return mat2(c, -s, s, c);
}

float GetDist(vec3 p) {
  float d = p.y+4.;
  p.z -= iTime;
  float h = max(0., noise_itself(p.xz*0.01+13.7)); 
  h = pow(h, 1.6)*8.;
  d -= h;
  
  return d*0.3;
}

float RayMarch(vec3 ro, vec3 rd) {
  float dO=0.;
  
  for(int i=0; i<MAX_STEPS; i++) {
    vec3 p = ro + rd*dO;
      float dS = GetDist(p);
      dO += dS;
      if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
  }
  
  return dO;
}

vec3 GetNormal(vec3 p) {
  vec2 e = vec2(.001, 0);
  vec3 n = GetDist(p) - 
      vec3(GetDist(p-e.xyy), GetDist(p-e.yxy),GetDist(p-e.yyx));
  
  return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 
      f = normalize(l-p),
      r = normalize(cross(vec3(0,1,0), f)),
      u = cross(f,r),
      c = f*z,
      i = c + uv.x*r + uv.y*u;
  return normalize(i);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - .5*iResolution.xy)/iResolution.y;
  vec2 m = vec2(-.05, -0.5);
  // if(iMouse.z > 0.) m = iMouse.xy/iResolution.xy;

  vec3 ro = vec3(0, 3, -3);
  ro.yz *= Rot(-m.y*PI+1.);
  ro.y = max(ro.y, -1.);
  ro.xz *= Rot(-m.x*TAU);
  
  vec3 rd = GetRayDir(uv, ro, vec3(0,0.,0), 1.);
  vec3 col = vec3(0);

  float d = RayMarch(ro, rd);
  
  float sun = S(0.998,1.,dot(normalize(rd), normalize(vec3(0.,0.5,-1.))));
  if(d<MAX_DIST) {
      vec3 p = ro + rd * d;
      vec3 n = GetNormal(p);
      
      vec3 lightDir = normalize(vec3(0.0, .5,-.5));

      float fre = max(0.,dot(n, normalize(ro-p)));
      fre = pow(fre,.125);
      fre = S(0.8,0.85,fre);
      fre = mix(fre, 1., S(-0.0, -4., p.y));
      
      float heigh = S(-4., 0., p.y);
      col = mix(vec3(0.6588,0.5176,0.2824), vec3(0.3059, 0.4627, 0.633), heigh)*fre;
      
      heigh = S(-4.1, -3.9, p.y);
      col = mix(vec3(0.6,0.55,0.2)*S(0.,15., d), col, heigh);
      
      sun = .0;
  }
  
  col = mix(col, vec3(0.6588,0.5176,0.2824)*1.5, S(0.,100., d));
  
  col = mix(col, vec3(1.,0.4,0.), sun);

  gl_FragColor = vec4(col, 1.);
}
`