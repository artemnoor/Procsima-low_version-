(function () {
    const COMPARE_STORAGE_KEY = 'nps-compare-programs';
    const MAX_COMPARE_ITEMS = 3;
    const COMPARE_UPDATED_EVENT = 'nps:compare-updated';

    function getHeaderCompareCount() {
        try {
            const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? Math.min(parsed.length, MAX_COMPARE_ITEMS) : 0;
        } catch (_error) {
            return 0;
        }
    }

    function updateHeaderComparePill() {
        const link = document.getElementById('headerCompareLink');
        const text = document.getElementById('headerCompareText');
        if (!link || !text) {
            return;
        }

        const count = getHeaderCompareCount();
        text.textContent = `${count} \u0438\u0437 ${MAX_COMPARE_ITEMS}`;
        link.classList.toggle('is-active', count > 0);
        link.setAttribute(
            'aria-label',
            count > 0
                ? `\u0421\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435, \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u043e ${count} \u0438\u0437 ${MAX_COMPARE_ITEMS}`
                : '\u0421\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435, \u043f\u043e\u043a\u0430 \u043f\u0443\u0441\u0442\u043e'
        );
    }

    window.updateHeaderComparePill = updateHeaderComparePill;

    document.addEventListener('DOMContentLoaded', updateHeaderComparePill);
    window.addEventListener('storage', updateHeaderComparePill);
    window.addEventListener('pageshow', updateHeaderComparePill);
    window.addEventListener('focus', updateHeaderComparePill);
    window.addEventListener(COMPARE_UPDATED_EVENT, updateHeaderComparePill);
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            updateHeaderComparePill();
        }
    });
})();
