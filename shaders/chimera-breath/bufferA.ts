export const buffA = /*glsl*/`
//Chimera's Breath
//by nimitz 2018 (twitter: @stormoid)

//see "Common" tab for fluid simulation code

float length2(vec2 p){return dot(p,p);}
mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}

void main()
{
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    vec2 w = 1.0/iResolution.xy;
    
    vec4 lastMouse = texelFetch(iChannel0, ivec2(0,0), 0);
    vec4 data = solveFluid(iChannel0, uv, w, iTime, iMouse.xyz, lastMouse.xyz);
    
    if (iFrame < 20.)
    {
        data = vec4(0.5,0,0,0);
    }
    
    if (gl_FragCoord.y < 1.)
        data = iMouse;
    
    gl_FragColor = data;
    
}
`