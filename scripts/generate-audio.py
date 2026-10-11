import wave, math, random, struct, os
random.seed(841)
root='public/assets/audio'; os.makedirs(root,exist_ok=True); rate=22050

def save(name,samples):
    peak=max(1,max(abs(x) for x in samples)); data=b''.join(struct.pack('<h',int(max(-1,min(1,x/peak*.72))*32767)) for x in samples)
    with wave.open(f'{root}/{name}.wav','wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(data)
def tone(freq,dur,kind='glass',slide=0):
    out=[]
    for n in range(int(rate*dur)):
        t=n/rate; p=t/dur; f=freq+slide*p; env=(1-math.exp(-t*100))*math.exp(-t*(5 if kind!='pad' else 1.2))
        if kind=='glass':x=math.sin(2*math.pi*f*t)+.34*math.sin(2*math.pi*f*2.7*t)+.19*math.sin(2*math.pi*f*4.1*t)
        elif kind=='knock':x=math.sin(2*math.pi*f*t)+.28*random.uniform(-1,1)
        elif kind=='noise':x=random.uniform(-1,1)
        else:x=math.sin(2*math.pi*f*t)+.22*math.sin(4*math.pi*f*t)
        out.append(x*env)
    return out
def mix(*tracks):
    out=[0]*max(map(len,tracks))
    for track in tracks:
        for i,x in enumerate(track):out[i]+=x
    return out
def delay(arr,t):return [0]*int(rate*t)+arr
for name,f,d,k,s in [('select',720,.12,'glass',140),('swap',410,.2,'glass',280),('refuse',170,.16,'knock',-110),('land',125,.25,'knock',-55),('flaw',390,.18,'noise',0),('cut',920,.35,'glass',250),('levelup',520,.8,'glass',420),('gameover',420,.75,'pad',-250)]:
    a=tone(f,d,k,s)
    if name=='cut':a=mix(a,delay(tone(1430,.22),.06))
    if name=='levelup':a=mix(a,delay(tone(660,.5),.16),delay(tone(880,.5),.32))
    save(name,a)
for i in range(8):save(f'chain-{i+1}',mix(tone(450*2**(i/12),.28),delay(tone(675*2**(i/12),.16),.025)))
save('clear',mix(tone(450,.28),delay(tone(675,.16),.025)))
save('shatter',mix(tone(160,.5,'noise'),tone(700,.18,'glass')))
notes={'title':[(0,76),(.25,79),(.5,83),(.75,88),(1.25,83),(1.5,79),(1.75,76),(2.2,74),(2.5,79),(2.75,83),(3,86),(3.5,83)],'play':[(0,64),(.5,69),(1,72),(1.5,76),(2,72),(2.5,69),(3,67),(3.5,71),(4,74),(4.5,79),(5,74),(5.5,71)]}
for name,seq in notes.items():
    length=4.5 if name=='title' else 6.6; a=[0]*int(rate*length)
    for t,n in seq:
        f=440*2**((n-69)/12)
        for j,x in enumerate(tone(f,.9 if name=='title' else 1.4,'glass' if name=='title' else 'pad')):
            at=int(t*rate)+j
            if at<len(a):a[at]+=x*.55
    for t in range(int(length)):
        for j,x in enumerate(tone(110 if t%2==0 else 164,.4,'pad')):
            at=int(t*rate)+j
            if at<len(a):a[at]+=x*.18
    save(name,a)
    # format-0 MIDI with matching struck notes
    def vlq(v):
        x=[v&127];v>>=7
        while v:x.insert(0,(v&127)|128);v>>=7
        return bytes(x)
    ev=[]
    for t,n in seq:ev.extend([(int(t*480),bytes([0x90,n,90])),(int((t+.42)*480),bytes([0x80,n,0]))])
    ev.sort(key=lambda x:x[0]);track=b'\x00\xff\x51\x03\x07\xa1\x20';last=0
    for tick,msg in ev:track+=vlq(tick-last)+msg;last=tick
    track+=b'\x00\xff\x2f\x00'
    open(f'{root}/{name}.mid','wb').write(b'MThd'+struct.pack('>IHHH',6,0,1,480)+b'MTrk'+struct.pack('>I',len(track))+track)
