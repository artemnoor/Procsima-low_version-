(function () {
    const pageConfig = window.PROFTEST_PAGE;
    const engine = window.ProftestEngine;

    if (!pageConfig || !pageConfig.questionId || !engine) {
        return;
    }

    const state = engine.getQuestionPageState(pageConfig.questionId);
    if (state.redirect) {
        window.location.replace(state.redirect);
        return;
    }

    let selectedOptionId = state.answer ? state.answer.optionId : null;

    function renderPulse() {
        const list = document.getElementById('pulse-list');
        if (!list) {
            return;
        }
        const labels = state.topClusters.length ? state.topClusters : ['software', 'infrastructure', 'electronics'];
        list.innerHTML = labels.map((key, index) => {
            const width = Math.max(36, 92 - index * 18);
            const meta = engine.dimensionMeta[key];
            return `
                <div class="pulse-row">
                    <div>
                        <div class="pulse-label">${meta.short}</div>
                        <div class="pulse-bar"><div class="pulse-fill" style="width:${width}%"></div></div>
                    </div>
                    <div class="pulse-label">${index + 1}</div>
                </div>
            `;
        }).join('');
    }

    function renderSelection() {
        document.querySelectorAll('[data-option-id]').forEach((button) => {
            const isSelected = button.dataset.optionId === selectedOptionId;
            button.classList.toggle('selected', isSelected);
        });

        const nextButton = document.getElementById('next-btn');
        if (nextButton) {
            nextButton.disabled = !selectedOptionId;
        }
    }

    const stepIndicator = document.getElementById('step-indicator');
    if (stepIndicator) {
        stepIndicator.textContent = `Вопрос ${state.step} из ${state.total}`;
    }

    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${(state.step / state.total) * 100}%`;
    }

    const qNum = document.getElementById('q-num');
    if (qNum) {
        qNum.textContent = state.step;
    }

    document.querySelectorAll('[data-option-id]').forEach((button) => {
        button.addEventListener('click', () => {
            selectedOptionId = button.dataset.optionId;
            renderSelection();
        });
    });

    const backButton = document.getElementById('back-btn');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = state.previousRoute;
        });
    }

    const nextButton = document.getElementById('next-btn');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (!selectedOptionId) {
                return;
            }
            const session = engine.saveSingleChoice(pageConfig.questionId, selectedOptionId);
            window.location.href = engine.getNextQuestionRoute(session);
        });
    }

    renderPulse();
    renderSelection();
})();
