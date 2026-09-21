gsap.registerPlugin(
    ScrollTrigger
);


// =========================================================
// MAIN
// =========================================================

const main =
    document.querySelector(
        "#main"
    );


// =========================================================
// LOCOMOTIVE
// =========================================================

const locoScroll =
    new LocomotiveScroll({

        el:
            main,

        smooth:
            true,

        lerp:
            0.08

    });


locoScroll.on(
    "scroll",
    ScrollTrigger.update
);


// =========================================================
// SCROLLER PROXY
// =========================================================

ScrollTrigger.scrollerProxy(
    main,
    {

        scrollTop(value) {

            if (
                arguments.length
            ) {

                locoScroll.scrollTo(
                    value,
                    0,
                    0
                );

                return;

            }


            return (
                locoScroll
                    .scroll
                    .instance
                    .scroll
                    .y
            );

        },


        getBoundingClientRect() {

            return {

                top:
                    0,

                left:
                    0,

                width:
                    window.innerWidth,

                height:
                    window.innerHeight

            };

        },


        pinType:

            main.style.transform

                ? "transform"

                : "fixed"

    }
);


// =========================================================
// PERSONAGEM PRINCIPAL
// =========================================================

const canvas =
    document.querySelector(
        "#personagem"
    );


const context =
    canvas.getContext(
        "2d"
    );


// =========================================================
// AJUSTAR CANVAS PRINCIPAL
// =========================================================

function ajustarCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        window.innerWidth *
        dpr;


    canvas.height =
        window.innerHeight *
        dpr;


    canvas.style.width =
        window.innerWidth +
        "px";


    canvas.style.height =
        window.innerHeight +
        "px";


    context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


ajustarCanvas();


// =========================================================
// PERSONAGEM - 241 FRAMES
// =========================================================

const frameCount =
    241;


const images =
    new Array(
        frameCount
    );


const imageSeq = {

    frame:
        0

};


// =========================================================
// CAMINHO PERSONAGEM
// =========================================================

function currentFrame(index) {

    const numero =
        String(index)
            .padStart(
                5,
                "0"
            );


    return (
        "./Personagem_1/" +
        "Personagem_1__" +
        numero +
        ".png"
    );

}


// =========================================================
// PRELOAD PERSONAGEM
// =========================================================

for (
    let i = 0;
    i < frameCount;
    i++
) {

    const img =
        new Image();


    images[i] =
        img;


    img.src =
        currentFrame(i);


    img.onerror =
        () => {

            console.error(
                "ERRO PERSONAGEM:",
                currentFrame(i)
            );

        };


    if (
        i === 0
    ) {

        img.onload =
            render;

    }

}


// =========================================================
// RENDER PERSONAGEM
// =========================================================

function render() {

    const frame =
        Math.max(
            0,

            Math.min(
                frameCount - 1,

                Math.round(
                    imageSeq.frame
                )
            )
        );


    const img =
        images[frame];


    if (
        !img ||
        !img.complete ||
        img.naturalWidth === 0
    ) {

        return;

    }


    drawPersonagem(
        img
    );

}


// =========================================================
// DRAW PERSONAGEM
// =========================================================

function drawPersonagem(img) {

    const cw =
        window.innerWidth;


    const ch =
        window.innerHeight;


    context.clearRect(
        0,
        0,
        cw,
        ch
    );


    const hRatio =
        cw /
        img.naturalWidth;


    const vRatio =
        ch /
        img.naturalHeight;


    const baseRatio =
        Math.max(
            hRatio,
            vRatio
        );


    const personagemScale =
        0.78;


    const ratio =
        baseRatio *
        personagemScale;


    const width =
        img.naturalWidth *
        ratio;


    const height =
        img.naturalHeight *
        ratio;


    const x =
        (
            cw -
            width
        ) / 2;


    const y =
        ch -
        height;


    context.drawImage(
        img,

        x,
        y,

        width,
        height
    );

}


// =========================================================
// PERSONAGEM CONTROLADO PELO SCROLL
// =========================================================

gsap.to(
    imageSeq,
    {

        frame:
            frameCount - 1,

        snap:
            "frame",

        ease:
            "none",

        onUpdate:
            render,


        scrollTrigger: {

            trigger:
                "#main",

            start:
                "top top",

            end:
                "bottom bottom",

            scrub:
                0.15,

            scroller:
                main

        }

    }
);


// =========================================================
// TEXTOS DAS SEÇÕES
// =========================================================

const secoes =
    gsap.utils.toArray(
        ".secao"
    );


secoes.forEach(
    (
        secao,
        index
    ) => {

        if (
            index === 0
        ) {

            return;

        }


        const texto =
            secao.querySelector(
                ".texto"
            );


        if (
            !texto
        ) {

            return;

        }


        gsap.fromTo(
            texto,

            {

                y:
                    80,

                opacity:
                    0

            },

            {

                y:
                    0,

                opacity:
                    1,

                ease:
                    "none",


                scrollTrigger: {

                    trigger:
                        secao,

                    start:
                        "top 85%",

                    end:
                        "top 40%",

                    scrub:
                        true,

                    scroller:
                        main

                }

            }
        );

    }
);


// =========================================================
// SCRAMBLE HERO
// =========================================================

const heroSubtitle =
    document.querySelector(
        "#hero-subtitle"
    );


const subtitleFinal =
    heroSubtitle.dataset.text;


const scrambleCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&";


const scrambleDuration =
    1600;


let scrambleStart =
    null;


gsap.set(
    heroSubtitle,
    {

        opacity:
            .55,

        filter:
            "blur(7px)"

    }
);


function scrambleSubtitle(now) {

    if (
        scrambleStart === null
    ) {

        scrambleStart =
            now;

    }


    const progress =
        Math.min(
            (
                now -
                scrambleStart
            ) /
            scrambleDuration,

            1
        );


    const resolved =
        Math.floor(
            progress *
            subtitleFinal.length
        );


    heroSubtitle.textContent =
        subtitleFinal
            .split("")
            .map(
                (
                    character,
                    index
                ) => {

                    if (
                        character === " "
                    ) {

                        return " ";

                    }


                    if (
                        index <
                        resolved
                    ) {

                        return character;

                    }


                    return scrambleCharacters[
                        Math.floor(
                            Math.random() *
                            scrambleCharacters.length
                        )
                    ];

                }
            )
            .join("");


    if (
        progress <
        1
    ) {

        requestAnimationFrame(
            scrambleSubtitle
        );

    }

    else {

        heroSubtitle.textContent =
            subtitleFinal;

    }

}


requestAnimationFrame(
    scrambleSubtitle
);


gsap.to(
    heroSubtitle,
    {

        opacity:
            1,

        filter:
            "blur(0px)",

        duration:
            1.6,

        ease:
            "power2.out"

    }
);


// =========================================================
// CABEÇA CRT
// 120 FRAMES
// =========================================================

const cabecaCanvas =
    document.querySelector(
        "#cabeca-canvas"
    );


const cabecaContext =
    cabecaCanvas.getContext(
        "2d"
    );


const cabecaFrameNumber =
    document.querySelector(
        "#head-frame-number"
    );


const cabecaFrameProgress =
    document.querySelector(
        "#head-frame-progress"
    );


const cabecaFrameCount =
    120;


const cabecaImages =
    new Array(
        cabecaFrameCount
    );


const cabecaSequence = {

    frame:
        0

};


// =========================================================
// CAMINHO DOS FRAMES DA CABEÇA
// =========================================================

function cabecaCurrentFrame(index) {

    const numero =
        String(index)
            .padStart(
                5,
                "0"
            );


    return (
        "./Cabeca/" +
        "Cabeca__" +
        numero +
        ".png"
    );

}


// =========================================================
// PRELOAD DA CABEÇA
// =========================================================

for (
    let i = 0;
    i < cabecaFrameCount;
    i++
) {

    const img =
        new Image();


    cabecaImages[i] =
        img;


    img.src =
        cabecaCurrentFrame(i);


    img.onerror =
        () => {

            console.error(
                "ERRO CABEÇA:",
                cabecaCurrentFrame(i)
            );

        };


    if (
        i === 0
    ) {

        img.onload =
            () => {

                ajustarCabecaCanvas();

                renderCabeca();

            };

    }

}


// =========================================================
// AJUSTAR CANVAS CABEÇA
// =========================================================

function ajustarCabecaCanvas() {

    if (
        !cabecaCanvas
    ) {

        return;

    }


    const rect =
        cabecaCanvas
            .getBoundingClientRect();


    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    cabecaCanvas.width =
        Math.max(
            1,
            Math.round(
                rect.width *
                dpr
            )
        );


    cabecaCanvas.height =
        Math.max(
            1,
            Math.round(
                rect.height *
                dpr
            )
        );


    cabecaContext.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


// =========================================================
// RENDER CABEÇA
// =========================================================

function renderCabeca() {

    if (
        !cabecaCanvas
    ) {

        return;

    }


    const frame =
        Math.max(
            0,

            Math.min(
                cabecaFrameCount - 1,

                Math.round(
                    cabecaSequence.frame
                )
            )
        );


    const img =
        cabecaImages[frame];


    if (
        !img ||
        !img.complete ||
        img.naturalWidth === 0
    ) {

        return;

    }


    const cw =
        cabecaCanvas.clientWidth;


    const ch =
        cabecaCanvas.clientHeight;


    cabecaContext.clearRect(
        0,
        0,
        cw,
        ch
    );


    /*
    contain

    Mostra a cabeça inteira
    dentro da área.
    */

    const ratio =
        Math.min(
            cw /
            img.naturalWidth,

            ch /
            img.naturalHeight
        );


    /*
    Escala extra.

    Se quiser maior depois,
    aumente 1.00 para 1.10, 1.20 etc.
    */

    const headScale =
        1.00;


    const width =
        img.naturalWidth *
        ratio *
        headScale;


    const height =
        img.naturalHeight *
        ratio *
        headScale;


    const x =
        (
            cw -
            width
        ) / 2;


    const y =
        (
            ch -
            height
        ) / 2;


    cabecaContext.drawImage(
        img,

        x,
        y,

        width,
        height
    );


    // contador

    if (
        cabecaFrameNumber
    ) {

        cabecaFrameNumber.textContent =
            String(
                frame + 1
            )
            .padStart(
                3,
                "0"
            );

    }


    // barra

    if (
        cabecaFrameProgress
    ) {

        cabecaFrameProgress.style.width =
            (
                frame /
                (
                    cabecaFrameCount -
                    1
                ) *
                100
            ) +
            "%";

    }

}


// =========================================================
// LOOP AUTOMÁTICO DA CABEÇA
// =========================================================

gsap.to(
    cabecaSequence,
    {

        frame:
            cabecaFrameCount - 1,

        duration:
            5,

        ease:
            "none",

        repeat:
            -1,

        snap:
            "frame",

        onUpdate:
            renderCabeca

    }
);


// =========================================================
// ENTRADA DA CABEÇA
// =========================================================

gsap.fromTo(
    ".head-visual",

    {

        opacity:
            0,

        x:
            60,

        scale:
            .95

    },

    {

        opacity:
            1,

        x:
            0,

        scale:
            1,

        ease:
            "none",


        scrollTrigger: {

            trigger:
                "#page1",

            start:
                "top 80%",

            end:
                "top 40%",

            scrub:
                true,

            scroller:
                main

        }

    }
);


// =========================================================
// REFRESH
// =========================================================

ScrollTrigger.addEventListener(
    "refresh",
    () => {

        locoScroll.update();

    }
);


// =========================================================
// RESIZE
// =========================================================

window.addEventListener(
    "resize",
    () => {

        ajustarCanvas();

        render();

        ajustarCabecaCanvas();

        renderCabeca();

        locoScroll.update();

        ScrollTrigger.refresh();

    }
);


// =========================================================
// LOAD
// =========================================================

window.addEventListener(
    "load",
    () => {

        ajustarCanvas();

        render();

        ajustarCabecaCanvas();

        renderCabeca();

        locoScroll.update();

        ScrollTrigger.refresh();

    }
);


ScrollTrigger.refresh();