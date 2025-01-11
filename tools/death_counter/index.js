// "12345" を "12,345" のようにカンマで区切る
function formatNumberWithCommas(number) {
    let s = number.split('').reverse().join('');
    s = s.replace(/(\d{3})(?=\d)/g, '$1,');
    return s.split('').reverse().join('');
}

function drawDigits(canvas, ctx, digitsImage, iconImage, inputValue, dryrun) {
    if (!dryrun)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!/^[0-9]+$/.test(inputValue))
        return 0;

    inputValue = formatNumberWithCommas(inputValue);

    if (!dryrun)
        ctx.drawImage(iconImage, 0, 0);

    const digitWidth = digitsImage.width / 11;
    let dx = iconImage.width;
    for (let i = 0; i < inputValue.length; i++) {
        const digit = inputValue[i];
        const digitIndex = digit == ',' ? 10 : parseInt(digit);
        const w = digit == ',' ? digitWidth * 2.0 / 3.0 : digitWidth;
        if (!dryrun) {
            ctx.drawImage(
                digitsImage,
                digitIndex * digitWidth, // sx
                0, // sy
                w, // sw
                digitsImage.height, // sh
                dx, // dx
                0, // dy
                w, // dw
                digitsImage.height // dh
            );
        }
        dx += w;
    }

    return dx;
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

window.onload = () => {
    const canvas = document.getElementById("canvasDeathCounter");
    const ctx = canvas.getContext("2d");
    const countInput = document.getElementById("inputCount");
    const downloadButton = document.getElementById("downloadButton");

    Promise.all([
        loadImage("digits.webp"),
        loadImage("icon.webp"),
    ]).then(([digitsImage, iconImage]) => {

        countInput.addEventListener("input", () => {
            const inputValue = countInput.value.trim();
            const w = drawDigits(canvas, ctx, digitsImage, iconImage, inputValue, true);
            if (w > 0) {
                countInput.style.color = "";
                canvas.width = w;
            } else {
                // 何らかの理由で描画できない。テキストの文字色を変えてユーザーに伝える。
                countInput.style.color = "#e9171e";
            }
            drawDigits(canvas, ctx, digitsImage, iconImage, inputValue, false);
        });

        downloadButton.addEventListener("click", () => {
            const dataUrl = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "DC" + countInput.value.trim() + ".png";
            link.click();
        });

    }).catch(console.error);
}
