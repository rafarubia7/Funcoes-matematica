document.addEventListener('DOMContentLoaded', function() {
    // Inicializa a calculadora
    initCalculator();
    
    // Configurações iniciais
    coefA.value = 1;
    coefB.value = 0;
    coefC.value = -4;
    
    // Calcula a função inicial
    calculateQuadraticFunction();
});

// Seleciona elementos do DOM
const coefA = document.getElementById('coef-a');
const coefB = document.getElementById('coef-b');
const coefC = document.getElementById('coef-c');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const functionDisplay = document.getElementById('function-display');
const existenceCondition = document.getElementById('existence-condition');
const deltaResult = document.getElementById('delta');
const rootsResult = document.getElementById('roots');
const vertexResult = document.getElementById('vertex');
const yInterceptResult = document.getElementById('y-intercept');
const concavityResult = document.getElementById('concavity');
const graphContainer = document.getElementById('graph-container');
const stepsContainer = document.getElementById('steps-container');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const resetZoomBtn = document.getElementById('reset-zoom-btn');
const graphColorInput = document.getElementById('graph-color');

// Variáveis do gráfico
let graphScale = 50;
let graphOffsetX = 0;
let graphOffsetY = 0;
let graphColor = '#3498db';

// Variáveis para controle do mouse
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function initCalculator() {
    // Event listeners
    calculateBtn.addEventListener('click', calculateQuadraticFunction);
    resetBtn.addEventListener('click', resetFields);
    
    zoomInBtn.addEventListener('click', () => {
        graphScale *= 1.2;
        calculateQuadraticFunction();
    });
    
    zoomOutBtn.addEventListener('click', () => {
        graphScale *= 0.8;
        calculateQuadraticFunction();
    });
    
    resetZoomBtn.addEventListener('click', () => {
        graphScale = 50;
        graphOffsetX = 0;
        graphOffsetY = 0;
        calculateQuadraticFunction();
    });
    
    graphColorInput.addEventListener('change', (e) => {
        graphColor = e.target.value;
        calculateQuadraticFunction();
    });
    
    // Permitir cálculo com Enter
    [coefA, coefB, coefC].forEach(input => {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') calculateQuadraticFunction();
        });
    });
    
    // Adicionar eventos para navegação do gráfico com o mouse
    graphContainer.addEventListener('mousedown', startDragging);
    window.addEventListener('mousemove', dragGraph);
    window.addEventListener('mouseup', stopDragging);
    // Impedir o comportamento padrão de arrastar em elementos
    graphContainer.addEventListener('dragstart', (e) => e.preventDefault());
}

// Funções para navegação do gráfico
function startDragging(e) {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    graphContainer.style.cursor = 'grabbing'; // Mudar cursor durante arrasto
}

function dragGraph(e) {
    if (!isDragging) return;
    
    // Calcular a diferença de posição
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    
    // Atualizar a posição
    graphOffsetX += deltaX;
    graphOffsetY += deltaY;
    
    // Atualizar as coordenadas anteriores
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    
    // Redesenhar o gráfico
    const a = parseFloat(coefA.value) || 0;
    const b = parseFloat(coefB.value) || 0;
    const c = parseFloat(coefC.value) || 0;
    
    if (a !== 0) {
        drawGraph(a, b, c);
    }
}

function stopDragging() {
    isDragging = false;
    graphContainer.style.cursor = 'auto'; // Restaurar cursor
}

function calculateQuadraticFunction() {
    const a = parseFloat(coefA.value) || 0;
    const b = parseFloat(coefB.value) || 0;
    const c = parseFloat(coefC.value) || 0;
    
    // Verificar se é quadrática
    if (a === 0) {
        existenceCondition.textContent = 'Não é função quadrática (a = 0)';
        existenceCondition.style.color = 'red';
        stepsContainer.innerHTML = ''; // Limpa os passos anteriores
        return;
    }
    
    // Atualizar display da função
    functionDisplay.textContent = `f(x) = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;
    
    // Calcular propriedades
    const delta = b * b - 4 * a * c;
    const vx = -b / (2 * a);
    const vy = c - (b * b) / (4 * a);
    
    // Atualizar resultados
    deltaResult.textContent = `Δ = ${delta}`;
    vertexResult.textContent = `V = (${vx.toFixed(2)}, ${vy.toFixed(2)})`;
    yInterceptResult.textContent = `(0, ${c})`;
    concavityResult.textContent = a > 0 ? 'Voltada para cima' : 'Voltada para baixo';
    
    // Calcular raízes
    let rootsText = '';
    if (delta < 0) {
        rootsText = 'Não tem raízes reais';
    } else if (delta === 0) {
        const root = -b / (2 * a);
        rootsText = `x = ${root.toFixed(2)} (raiz dupla)`;
    } else {
        const root1 = (-b + Math.sqrt(delta)) / (2 * a);
        const root2 = (-b - Math.sqrt(delta)) / (2 * a);
        rootsText = `x₁ = ${root1.toFixed(2)}, x₂ = ${root2.toFixed(2)}`;
    }
    rootsResult.textContent = rootsText;
    
    // Desenhar gráfico
    drawGraph(a, b, c);
    
    // Gerar passo a passo
    generateSteps(a, b, c, delta);
}

function generateSteps(a, b, c, delta) {
    // Limpar container de passos
    stepsContainer.innerHTML = '';
    
    // Passo 1: Identificar a função e seus coeficientes
    const step1 = document.createElement('div');
    step1.className = 'step';
    step1.innerHTML = `
        <div class="step-header">Passo 1: Identificar os coeficientes</div>
        <div class="step-content">
            <p>Na função quadrática f(x) = ax² + bx + c, temos:</p>
            <p>a = ${a}</p>
            <p>b = ${b}</p>
            <p>c = ${c}</p>
            <p>Função: f(x) = ${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}</p>
        </div>
    `;
    stepsContainer.appendChild(step1);
    
    // Passo 2: Calcular o discriminante (delta)
    const step2 = document.createElement('div');
    step2.className = 'step';
    step2.innerHTML = `
        <div class="step-header">Passo 2: Calcular o discriminante (delta)</div>
        <div class="step-content">
            <p>Fórmula: Δ = b² - 4ac</p>
            <p>Substituindo: Δ = ${b}² - 4 × ${a} × ${c}</p>
            <p>Δ = ${b*b} - ${4*a*c}</p>
            <p>Δ = ${delta}</p>
        </div>
    `;
    stepsContainer.appendChild(step2);
    
    // Passo 3: Encontrar as raízes (zeros da função)
    const step3 = document.createElement('div');
    step3.className = 'step';
    step3.innerHTML = `
        <div class="step-header">Passo 3: Encontrar as raízes</div>
        <div class="step-content">
            <p>Fórmula: x = (-b ± √Δ) / 2a</p>
    `;
    
    if (delta < 0) {
        step3.querySelector('.step-content').innerHTML += `
            <p>Como Δ = ${delta} < 0, a função não possui raízes reais.</p>
        `;
    } else if (delta === 0) {
        const root = -b / (2 * a);
        step3.querySelector('.step-content').innerHTML += `
            <p>Como Δ = 0, a função possui uma raiz real (raiz dupla):</p>
            <p>x = -b / 2a = -${b} / (2 × ${a}) = ${root.toFixed(4)}</p>
            <p>Portanto, x = ${root.toFixed(2)}</p>
        `;
    } else {
        const sqrtDelta = Math.sqrt(delta);
        const root1 = (-b + sqrtDelta) / (2 * a);
        const root2 = (-b - sqrtDelta) / (2 * a);
        
        step3.querySelector('.step-content').innerHTML += `
            <p>Como Δ = ${delta} > 0, a função possui duas raízes reais:</p>
            <p>x₁ = (-b + √Δ) / 2a = (-${b} + √${delta}) / (2 × ${a})</p>
            <p>x₁ = (-${b} + ${sqrtDelta.toFixed(4)}) / ${2*a}</p>
            <p>x₁ = ${(-b + sqrtDelta).toFixed(4)} / ${2*a} = ${root1.toFixed(4)}</p>
            <p>x₂ = (-b - √Δ) / 2a = (-${b} - √${delta}) / (2 × ${a})</p>
            <p>x₂ = (-${b} - ${sqrtDelta.toFixed(4)}) / ${2*a}</p>
            <p>x₂ = ${(-b - sqrtDelta).toFixed(4)} / ${2*a} = ${root2.toFixed(4)}</p>
            <p>Portanto, x₁ = ${root1.toFixed(2)} e x₂ = ${root2.toFixed(2)}</p>
        `;
    }
    
    stepsContainer.appendChild(step3);
    
    // Passo 4: Calcular o vértice
    const vx = -b / (2 * a);
    const vy = -delta / (4 * a);
    
    const step4 = document.createElement('div');
    step4.className = 'step';
    step4.innerHTML = `
        <div class="step-header">Passo 4: Encontrar o vértice</div>
        <div class="step-content">
            <p>Fórmulas:</p>
            <p>x<sub>v</sub> = -b / 2a</p>
            <p>y<sub>v</sub> = -Δ / 4a   ou   y<sub>v</sub> = f(x<sub>v</sub>)</p>
            <p>Substituindo:</p>
            <p>x<sub>v</sub> = -${b} / (2 × ${a}) = ${vx.toFixed(4)}</p>
            <p>y<sub>v</sub> = -${delta} / (4 × ${a}) = ${vy.toFixed(4)}</p>
            <p>Portanto, o vértice V = (${vx.toFixed(2)}, ${vy.toFixed(2)})</p>
            <p>Este é o ponto ${a > 0 ? 'mínimo' : 'máximo'} da função.</p>
        </div>
    `;
    stepsContainer.appendChild(step4);
    
    // Passo 5: Analisar a concavidade e outras propriedades
    const step5 = document.createElement('div');
    step5.className = 'step';
    step5.innerHTML = `
        <div class="step-header">Passo 5: Analisar a concavidade e outras propriedades</div>
        <div class="step-content">
            <p>• Concavidade: ${a > 0 ? 'Para cima (∪)' : 'Para baixo (∩)'} pois a = ${a} ${a > 0 ? '> 0' : '< 0'}</p>
            <p>• Interseção com o eixo y: (0, ${c})</p>
            <p>• Domínio: ℝ (todos os números reais)</p>
            <p>• Imagem: ${a > 0 ? `[${vy.toFixed(2)}, +∞)` : `(-∞, ${vy.toFixed(2)}]`}</p>
            <p>• A função é ${a > 0 ? 'crescente para x > ' + vx.toFixed(2) + ' e decrescente para x < ' + vx.toFixed(2) : 'crescente para x < ' + vx.toFixed(2) + ' e decrescente para x > ' + vx.toFixed(2)}</p>
        </div>
    `;
    stepsContainer.appendChild(step5);
    
    // Aplicar animação nas etapas
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.animationDelay = `${0.2 * index}s`;
    });
}

function drawGraph(a, b, c) {
    // Limpar container
    graphContainer.innerHTML = '';
    
    // Criar canvas
    const canvas = document.createElement('canvas');
    canvas.width = graphContainer.clientWidth;
    canvas.height = graphContainer.clientHeight;
    graphContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Desenhar eixos
    drawAxes(ctx, canvas.width, canvas.height);
    
    // Desenhar parábola
    drawParabola(ctx, a, b, c, canvas.width, canvas.height);
    
    // Marcar pontos importantes
    markImportantPoints(ctx, a, b, c, canvas.width, canvas.height);
}

function drawAxes(ctx, width, height) {
    const originX = width / 2 + graphOffsetX;
    const originY = height / 2 + graphOffsetY;
    
    // Eixos
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    
    // Eixo X
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    
    // Eixo Y
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();
    
    // Marcadores
    ctx.fillStyle = '#555';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Marcadores do eixo X
    const xStart = Math.ceil((-originX) / graphScale);
    const xEnd = Math.floor((width - originX) / graphScale);
    
    for (let i = xStart; i <= xEnd; i++) {
        if (i === 0) continue;
        const x = originX + i * graphScale;
        ctx.beginPath();
        ctx.moveTo(x, originY - 5);
        ctx.lineTo(x, originY + 5);
        ctx.stroke();
        ctx.fillText(i.toString(), x, originY + 8);
    }
    
    // Marcadores do eixo Y
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    const yStart = Math.ceil((-originY) / graphScale);
    const yEnd = Math.floor((height - originY) / graphScale);
    
    for (let i = yStart; i <= yEnd; i++) {
        if (i === 0) continue;
        const y = originY - i * graphScale;
        ctx.beginPath();
        ctx.moveTo(originX - 5, y);
        ctx.lineTo(originX + 5, y);
        ctx.stroke();
        ctx.fillText(i.toString(), originX - 8, y);
    }
    
    // Origem (0,0)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('0', originX - 8, originY + 8);
}

function drawParabola(ctx, a, b, c, width, height) {
    const originX = width / 2 + graphOffsetX;
    const originY = height / 2 + graphOffsetY;
    
    ctx.strokeStyle = graphColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let firstPoint = true;
    
    for (let pixelX = 0; pixelX < width; pixelX++) {
        const x = (pixelX - originX) / graphScale;
        const y = a * x * x + b * x + c;
        const pixelY = originY - y * graphScale;
        
        if (pixelY > -1000 && pixelY < height + 1000) {
            if (firstPoint) {
                ctx.moveTo(pixelX, pixelY);
                firstPoint = false;
            } else {
                ctx.lineTo(pixelX, pixelY);
            }
        }
    }
    
    ctx.stroke();
}

function markImportantPoints(ctx, a, b, c, width, height) {
    const originX = width / 2 + graphOffsetX;
    const originY = height / 2 + graphOffsetY;
    const delta = b * b - 4 * a * c;
    
    // Vértice
    const vx = -b / (2 * a);
    const vy = c - (b * b) / (4 * a);
    const vertexX = originX + vx * graphScale;
    const vertexY = originY - vy * graphScale;
    
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(vertexX, vertexY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`V(${vx.toFixed(2)}, ${vy.toFixed(2)})`, vertexX + 10, vertexY - 5);
    
    // Raízes
    if (delta >= 0) {
        const sqrtDelta = Math.sqrt(delta);
        const x1 = (-b + sqrtDelta) / (2 * a);
        const x2 = (-b - sqrtDelta) / (2 * a);
        
        // Primeira raiz
        const root1X = originX + x1 * graphScale;
        const root1Y = originY;
        
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(root1X, root1Y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`x₁=${x1.toFixed(2)}`, root1X, root1Y + 10);
        
        // Segunda raiz (se diferente)
        if (delta > 0) {
            const root2X = originX + x2 * graphScale;
            const root2Y = originY;
            
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.arc(root2X, root2Y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#333';
            ctx.fillText(`x₂=${x2.toFixed(2)}`, root2X, root2Y + 10);
        }
    }
    
    // Interseção com eixo Y
    const yInterceptX = originX;
    const yInterceptY = originY - c * graphScale;
    
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(yInterceptX, yInterceptY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#333';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`(0,${c})`, yInterceptX - 10, yInterceptY);
}

function resetFields() {
    coefA.value = '1';
    coefB.value = '0';
    coefC.value = '-4';
    calculateQuadraticFunction();
}

// Redesenhar ao redimensionar
window.addEventListener('resize', () => {
    const a = parseFloat(coefA.value) || 0;
    const b = parseFloat(coefB.value) || 0;
    const c = parseFloat(coefC.value) || 0;
    
    if (a !== 0) {
        drawGraph(a, b, c);
    }
});