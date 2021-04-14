const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d'/*, { alpha: false }*/);

const size = 50;
const radius = 25;
const border = 2;

if (canvas.getContext) {
    const drawCircle = (x, y) => {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.fill();
    };
    const drawQuadrate = (x, y) => {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.rect(x, y, size, size);
        ctx.stroke();
        ctx.fill();
    };

    var figures = [];
    const loadData = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        figures.forEach(figure => {
            if (figure.type === 'circle') {
                drawCircle(figure.x, figure.y);
            }
            else if (figure.type === 'quadrate') {
                drawQuadrate(figure.x, figure.y);
            }
        })
    };

    const dragndrop = (event, selectedFigure) => {
        if (event.target.classList.contains('circle')
            || event.target.classList.contains('quadrate')
            || selectedFigure) {
            let x = event.clientX;
            let y = event.clientY;
            let dx = size / Math.sqrt(2);
            let dy = size / Math.sqrt(2);
            let figureType = '';

            if (selectedFigure) {
                figureType = selectedFigure.type;
                figures.splice(figures.indexOf(selectedFigure), 1);
                if (figureType === 'circle') {
                    dx = x - selectedFigure.x - (size * 2 - border) + radius;
                    dy = y - selectedFigure.y + radius;
                } else if (figureType === 'quadrate') {
                    dx = x - selectedFigure.x - (size * 2 - border);
                    dy = y - selectedFigure.y;
                }
                loadData()
            } else figureType = event.target.classList[0];
            dragFigure = document.createElement('div');
            dragFigure.classList.add(figureType);
            dragFigure.classList.add('drag');
            dragFigure.style.left = x - dx + 'px';
            dragFigure.style.top = y - dy + 'px';
            document.body.appendChild(dragFigure);

            const mouseMove = (event) => {
                let x = event.clientX;
                let y = event.clientY;
                dragFigure.style.left = x - dx + 'px';
                dragFigure.style.top = y - dy + 'px';
            };

            document.addEventListener('mousemove', mouseMove);

            const mouseUp = (event) => {
                dragFigure.remove();
                document.removeEventListener('mousemove', mouseMove);
                let canvasX = event.clientX - (size * 2 - border);
                let canvasY = event.clientY;
                if (canvasX > 0
                    && canvasX < canvas.width
                    && canvasY > 0
                    && canvasY < canvas.height) {
                    figures.forEach(figure => {
                        figure.selected = false
                    });
                    dragFigure.selected = true;
                    if (figureType === 'circle') {
                        figures.push({
                            type: 'circle',
                            x: canvasX - dx + radius,
                            y: canvasY - dy + radius,
                            selected: true
                        });
                        drawCircle(canvasX - dx + radius, canvasY - dy + radius);
                        loadData();
                        figureType = null;
                    }
                    else if (figureType === 'quadrate') {
                        figures.push({type: 'quadrate', x: canvasX - dx, y: canvasY - dy, selected: true});
                        drawQuadrate(canvasX - dx, canvasY - dy);
                        loadData();
                        figureType = null;
                    }
                }
                document.removeEventListener('mouseup', mouseUp);
            }
            document.addEventListener('mouseup', mouseUp);
        }
    };

    const selectFigure = (event) => {
        let x = event.offsetX;
        let y = event.offsetY;
        let selectedFigure = figures.find(figure => {
            if (figure.type === 'circle'
                && (figure.x - x) ** 2 + (figure.y - y) ** 2 <= radius ** 2) {
                return figure
            }
            if (figure.type === 'quadrate'
                && figure.x + size > x
                && figure.x <= x
                && figure.y + size > y
                && figure.y <= y) {
                return figure
            }
        });
        if (selectedFigure) {
            dragndrop(event, selectedFigure)
        } else {
            figures.forEach(figure => figure.selected = false)
        }
    };

    const figureToDelete = (event) => {
        if (event.key === "Backspace" || event.key === 'Delete') {
            let figureToDelete = figures.find(figure => figure.selected === true);
            figures.splice(figures.indexOf(figureToDelete), 1);
            loadData();
        }
    };

    //canvas.addEventListener('click', selectFigure);
    //document.addEventListener('click', dragndrop);
    canvas.addEventListener('mousedown', selectFigure);
    document.addEventListener('mousedown', dragndrop);
    document.addEventListener('keydown', figureToDelete);

    //localStorage

} else {
    window.alert("update your browser");
}