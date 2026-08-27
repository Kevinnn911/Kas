// File: script.js

/**
 * GoKas - System Monitoring Uang Kas Kelas
 * Versi 2.0 - Sistem Input Manual + Pengeluaran & Laporan Resmi
 */

// ==========================================================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================================================

const KAS_CONFIG = {
    BULANAN: 20000,
    MINGGUAN: 5000,
    MINGGU_PER_BULAN: 4
};

const BULAN_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const EXPENSE_CATEGORIES = [
    "Alat Tulis", "Fotokopi", "Konsumsi", "Kegiatan Kelas", "Kebersihan", "Lain-lain"
];

const DEFAULT_STUDENTS = [
    { id: "STD-001", nama: "Aerilyn Bellvania Akifa Setiawan", kelas: "X RPL 1", absen: 1 },
    { id: "STD-002", nama: "Afdhan Haritsah Aryoputro", kelas: "X RPL 1", absen: 2 },
    { id: "STD-003", nama: "Afshar Rahmandito", kelas: "X RPL 1", absen: 3 },
    { id: "STD-004", nama: "Albertus Kevin Daniswara", kelas: "X RPL 1", absen: 4 },
    { id: "STD-005", nama: "Albyan Maulana Bintang", kelas: "X RPL 1", absen: 5 },
    { id: "STD-006", nama: "Alvito Keanu Rudianto", kelas: "X RPL 1", absen: 6 },
    { id: "STD-007", nama: "Bagus Yusuf Arsadulloh", kelas: "X RPL 1", absen: 7 },
    { id: "STD-008", nama: "Calvin Fitrian Hermanto", kelas: "X RPL 1", absen: 8 },
    { id: "STD-009", nama: "Daffa Hisyam", kelas: "X RPL 1", absen: 9 },
    { id: "STD-010", nama: "Galang Adityant", kelas: "X RPL 1", absen: 10 },
    { id: "STD-011", nama: "Ihsan Dzaky Siregar", kelas: "X RPL 1", absen: 11 },
    { id: "STD-012", nama: "Jihan Aurellia Winata", kelas: "X RPL 1", absen: 12 },
    { id: "STD-013", nama: "Kevin Nursofyan Tirtawinata", kelas: "X RPL 1", absen: 13 },
    { id: "STD-014", nama: "Luthfiana Warna Almeisya", kelas: "X RPL 1", absen: 14 },
    { id: "STD-015", nama: "M. Arifki Putra", kelas: "X RPL 1", absen: 15 },
    { id: "STD-016", nama: "Maisaan Malachi Adnan", kelas: "X RPL 1", absen: 16 },
    { id: "STD-017", nama: "Marco Daniskvanoct Iskandar", kelas: "X RPL 1", absen: 17 },
    { id: "STD-018", nama: "Mohammad Faza Fauzan", kelas: "X RPL 1", absen: 18 },
    { id: "STD-019", nama: "Muhamad Ghossan Athallah", kelas: "X RPL 1", absen: 19 },
    { id: "STD-020", nama: "Muhamad Pashya", kelas: "X RPL 1", absen: 20 },
    { id: "STD-021", nama: "Muhamad Rayhan Umar Al Faruq", kelas: "X RPL 1", absen: 21 },
    { id: "STD-022", nama: "Muhamad Reno Alfiansyah", kelas: "X RPL 1", absen: 22 },
    { id: "STD-023", nama: "Muhammad Afshar Wijayanto", kelas: "X RPL 1", absen: 23 },
    { id: "STD-024", nama: "Muhammad Albian Fathirly", kelas: "X RPL 1", absen: 24 },
    { id: "STD-025", nama: "Muhammad Aufa Dzukwan", kelas: "X RPL 1", absen: 25 },
    { id: "STD-026", nama: "Muhammad Azhmal Firdaus", kelas: "X RPL 1", absen: 26 },
    { id: "STD-027", nama: "Muhammad Devano Adhytya", kelas: "X RPL 1", absen: 27 },
    { id: "STD-028", nama: "Naufal Faiz Zidan", kelas: "X RPL 1", absen: 28 },
    { id: "STD-029", nama: "Nayla Putri Zahratinnisa", kelas: "X RPL 1", absen: 29 },
    { id: "STD-030", nama: "Raffa Ramadhan", kelas: "X RPL 1", absen: 30 },
    { id: "STD-031", nama: "Raka Ahnaf Rafizah Bunjani", kelas: "X RPL 1", absen: 31 },
    { id: "STD-032", nama: "Reysen Febriges", kelas: "X RPL 1", absen: 32 },
    { id: "STD-033", nama: "Satrio Alvano Gonzales", kelas: "X RPL 1", absen: 33 },
    { id: "STD-034", nama: "Tegar Wira Padmanagara Rasyid", kelas: "X RPL 1", absen: 34 }
];

// ==========================================================================
// 2. APPLICATION STATE
// ==========================================================================

const state = {
    students: [],
    payments: [],
    expenses: [],
    activeBulan: "",
    activeTab: "kasmasuk",
    searchQuery: "",
    expenseSearchQuery: "",
    statusFilter: "ALL",
    expenseCategoryFilter: "ALL",
    sortBy: "absen-asc",
    currentPage: 1,
    pageSize: 10,
    theme: "light",
    editingStudentId: null,
    editingExpenseId: null,
    paymentStudentId: null,
    deletingType: null,
    deletingId: null,
    pendingImportData: null
};

let incomeChartInstance = null;
let statusChartInstance = null;

// ==========================================================================
// 3. HELPERS
// ==========================================================================

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatTanggal(dateString) {
    if (!dateString) return "-";
    var date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatBulan(bulanStr) {
    if (!bulanStr || !bulanStr.includes("-")) return bulanStr;
    var parts = bulanStr.split("-");
    var monthIndex = parseInt(parts[1], 10) - 1;
    if (monthIndex < 0 || monthIndex > 11) return bulanStr;
    return BULAN_NAMES[monthIndex] + " " + parts[0];
}

function getCurrentBulan() {
    var now = new Date();
    return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
}

function generateId(prefix, arr) {
    if (arr.length === 0) return prefix + "-001";
    var ids = arr.map(function(item) {
        var num = parseInt(item.id.replace(prefix + "-", ""), 10);
        return isNaN(num) ? 0 : num;
    });
    return prefix + "-" + String(Math.max.apply(null, ids.concat([0])) + 1).padStart(3, "0");
}

function showToast(title, message, type) {
    type = type || "success";
    var container = document.getElementById("toastContainer");
    if (!container) return;
    var toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    var iconClass = "fa-solid fa-circle-check";
    if (type === "error") iconClass = "fa-solid fa-circle-xmark";
    if (type === "warning") iconClass = "fa-solid fa-triangle-exclamation";
    if (type === "info") iconClass = "fa-solid fa-circle-info";
    toast.innerHTML = '<i class="' + iconClass + '"></i><div class="toast-content"><div class="toast-title">' + title + '</div><div class="toast-message">' + message + '</div></div>';
    container.appendChild(toast);
    setTimeout(function() { toast.classList.add("show"); }, 50);
    setTimeout(function() {
        toast.classList.remove("show");
        setTimeout(function() { if (container.contains(toast)) container.removeChild(toast); }, 300);
    }, 3500);
}

// ==========================================================================
// 4. STORAGE
// ==========================================================================

function loadStateFromStorage() {
    try {
        var s = localStorage.getItem("gokas_students");
        if (s) {
            var parsed = JSON.parse(s);
            state.students = (Array.isArray(parsed) && parsed.length > 0) ? parsed : JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        } else {
            state.students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
            localStorage.setItem("gokas_students", JSON.stringify(state.students));
        }
        var p = localStorage.getItem("gokas_payments");
        state.payments = p ? JSON.parse(p) : [];
        var e = localStorage.getItem("gokas_expenses");
        state.expenses = e ? JSON.parse(e) : [];
        var t = localStorage.getItem("gokas_theme");
        if (t) state.theme = t;
        state.activeBulan = getCurrentBulan();
    } catch (err) {
        console.error("Load error:", err);
        state.students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        state.payments = [];
        state.expenses = [];
    }
}

function saveStateToStorage() {
    try {
        localStorage.setItem("gokas_students", JSON.stringify(state.students));
        localStorage.setItem("gokas_payments", JSON.stringify(state.payments));
        localStorage.setItem("gokas_expenses", JSON.stringify(state.expenses));
    } catch (err) {
        console.error("Save error:", err);
        showToast("Error", "Gagal menyimpan data.", "error");
    }
}

function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("gokas_theme", theme);
    var icon = document.getElementById("themeIcon");
    if (icon) icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    renderCharts();
}

// ==========================================================================
// 5. DATA CALCULATIONS
// ==========================================================================

function getStudentById(id) { return state.students.find(function(s) { return s.id === id; }); }

function getStudentPaymentsForMonth(studentId, bulan) {
    return state.payments.filter(function(p) { return p.studentId === studentId && p.bulan === bulan; });
}

function getStudentTotalForMonth(studentId, bulan) {
    return getStudentPaymentsForMonth(studentId, bulan).reduce(function(s, p) { return s + p.nominal; }, 0);
}

function getStudentStatusForMonth(studentId, bulan) {
    var total = getStudentTotalForMonth(studentId, bulan);
    if (total >= KAS_CONFIG.BULANAN) return "Lunas";
    if (total > 0) return "Cicilan";
    return "Belum Bayar";
}

function getPaidWeeksForMonth(studentId, bulan) {
    return state.payments
        .filter(function(p) { return p.studentId === studentId && p.bulan === bulan && p.tipe === "mingguan"; })
        .map(function(p) { return p.mingguKe; });
}

function getMonthlyRecap(bulan) {
    return state.students.map(function(student) {
        var totalBayar = getStudentTotalForMonth(student.id, bulan);
        var sisa = Math.max(0, KAS_CONFIG.BULANAN - totalBayar);
        var status = getStudentStatusForMonth(student.id, bulan);
        var progressPercent = Math.min(100, Math.round((totalBayar / KAS_CONFIG.BULANAN) * 100));
        return { id: student.id, nama: student.nama, kelas: student.kelas, absen: student.absen, totalBayar: totalBayar, sisa: sisa, status: status, progressPercent: progressPercent };
    });
}

function getExpensesForMonth(bulan) {
    return state.expenses.filter(function(e) { return e.bulan === bulan; });
}

function getTotalIncome() { return state.payments.reduce(function(s, p) { return s + p.nominal; }, 0); }
function getTotalExpenses() { return state.expenses.reduce(function(s, e) { return s + e.nominal; }, 0); }

// ==========================================================================
// 6. DASHBOARD STATS
// ==========================================================================

function updateDashboardStats() {
    var totalMasuk = getTotalIncome();
    var totalKeluar = getTotalExpenses();
    var saldo = totalMasuk - totalKeluar;
    var recap = getMonthlyRecap(state.activeBulan);
    var lunasCount = recap.filter(function(r) { return r.status === "Lunas"; }).length;
    var totalSiswa = state.students.length;
    var percentage = totalSiswa > 0 ? Math.round((lunasCount / totalSiswa) * 100) : 0;

    var el = function(id) { return document.getElementById(id); };
    if (el("statSaldoKas")) el("statSaldoKas").textContent = formatRupiah(saldo);
    if (el("statTotalMasuk")) el("statTotalMasuk").textContent = formatRupiah(totalMasuk);
    if (el("statTotalKeluar")) el("statTotalKeluar").textContent = formatRupiah(totalKeluar);
    if (el("statTotalSiswa")) el("statTotalSiswa").textContent = totalSiswa + " Siswa";
    if (el("statPercentageText")) el("statPercentageText").textContent = percentage + "%";
    if (el("progressBarFill")) el("progressBarFill").style.width = percentage + "%";
    if (el("statProgressSubtext")) el("statProgressSubtext").textContent = lunasCount + " dari " + totalSiswa + " siswa lunas - " + formatBulan(state.activeBulan);

    // Tab badges
    if (el("tabBadgeMasuk")) el("tabBadgeMasuk").textContent = state.students.length;
    if (el("tabBadgeKeluar")) el("tabBadgeKeluar").textContent = getExpensesForMonth(state.activeBulan).length;

    // Expense month total
    var expMonthTotal = getExpensesForMonth(state.activeBulan).reduce(function(s, e) { return s + e.nominal; }, 0);
    if (el("expenseMonthTotal")) el("expenseMonthTotal").textContent = formatRupiah(expMonthTotal);

    // Print
    if (el("printSaldoKas")) el("printSaldoKas").textContent = formatRupiah(saldo);
    if (el("printTotalMasuk")) el("printTotalMasuk").textContent = formatRupiah(totalMasuk);
    if (el("printTotalKeluar")) el("printTotalKeluar").textContent = formatRupiah(totalKeluar);
}

// ==========================================================================
// 7. CHARTS
// ==========================================================================

function renderCharts() {
    if (typeof Chart === "undefined") return;
    var isDark = state.theme === "dark";
    var textColor = isDark ? "#94A3B8" : "#64748B";
    var gridColor = isDark ? "#334155" : "#E2E8F0";

    // Build 6-month data
    var incomeByMonth = {};
    var expenseByMonth = {};
    var now = new Date();
    for (var i = 5; i >= 0; i--) {
        var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        var key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
        incomeByMonth[key] = 0;
        expenseByMonth[key] = 0;
    }
    state.payments.forEach(function(p) { if (incomeByMonth.hasOwnProperty(p.bulan)) incomeByMonth[p.bulan] += p.nominal; });
    state.expenses.forEach(function(e) { if (expenseByMonth.hasOwnProperty(e.bulan)) expenseByMonth[e.bulan] += e.nominal; });

    var monthKeys = Object.keys(incomeByMonth).sort();
    var monthLabels = monthKeys.map(function(k) { return formatBulan(k); });
    var incomeData = monthKeys.map(function(k) { return incomeByMonth[k]; });
    var expenseData = monthKeys.map(function(k) { return expenseByMonth[k]; });

    var ctxIncome = document.getElementById("incomeChart");
    if (ctxIncome) {
        if (incomeChartInstance) incomeChartInstance.destroy();
        incomeChartInstance = new Chart(ctxIncome, {
            type: "bar",
            data: {
                labels: monthLabels,
                datasets: [
                    {
                        label: "Pemasukan",
                        data: incomeData,
                        backgroundColor: "rgba(34, 197, 94, 0.7)",
                        borderColor: "#22C55E",
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false
                    },
                    {
                        label: "Pengeluaran",
                        data: expenseData,
                        backgroundColor: "rgba(239, 68, 68, 0.7)",
                        borderColor: "#EF4444",
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: "top", labels: { color: textColor, padding: 12, font: { family: "Inter", size: 12 } } },
                    tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ": " + formatRupiah(ctx.raw); } } }
                },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor, callback: function(v) { return "Rp " + (v / 1000) + "rb"; } }, grid: { color: gridColor } }
                }
            }
        });
    }

    var ctxStatus = document.getElementById("statusChart");
    if (ctxStatus) {
        if (statusChartInstance) statusChartInstance.destroy();
        var recap = getMonthlyRecap(state.activeBulan);
        var cL = recap.filter(function(r) { return r.status === "Lunas"; }).length;
        var cC = recap.filter(function(r) { return r.status === "Cicilan"; }).length;
        var cB = recap.filter(function(r) { return r.status === "Belum Bayar"; }).length;
        statusChartInstance = new Chart(ctxStatus, {
            type: "doughnut",
            data: {
                labels: ["Lunas", "Cicilan", "Belum Bayar"],
                datasets: [{ data: [cL, cC, cB], backgroundColor: ["#22C55E", "#F59E0B", "#EF4444"], borderWidth: 2, borderColor: isDark ? "#1E293B" : "#FFFFFF" }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: "bottom", labels: { color: textColor, padding: 20, font: { family: "Inter", size: 12 } } } },
                cutout: "70%"
            }
        });
    }
}

// ==========================================================================
// 8. KAS MASUK TABLE
// ==========================================================================

function getFilteredRecap() {
    var recap = getMonthlyRecap(state.activeBulan);
    if (state.searchQuery.trim()) {
        var q = state.searchQuery.toLowerCase();
        recap = recap.filter(function(r) { return r.nama.toLowerCase().includes(q) || String(r.absen).includes(q) || r.kelas.toLowerCase().includes(q); });
    }
    if (state.statusFilter !== "ALL") recap = recap.filter(function(r) { return r.status === state.statusFilter; });
    recap.sort(function(a, b) {
        switch (state.sortBy) {
            case "name-asc": return a.nama.localeCompare(b.nama);
            case "name-desc": return b.nama.localeCompare(a.nama);
            case "total-desc": return b.totalBayar - a.totalBayar;
            case "total-asc": return a.totalBayar - b.totalBayar;
            case "absen-asc": return a.absen - b.absen;
            case "absen-desc": return b.absen - a.absen;
            default: return 0;
        }
    });
    return recap;
}

function renderTable() {
    var tbody = document.getElementById("paymentTableBody");
    var emptyState = document.getElementById("emptyState");
    if (!tbody) return;
    var filtered = getFilteredRecap();
    var totalCount = filtered.length;
    var totalPages = Math.ceil(totalCount / state.pageSize) || 1;
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    var start = (state.currentPage - 1) * state.pageSize;
    var end = Math.min(start + state.pageSize, totalCount);
    var page = filtered.slice(start, end);

    if (totalCount === 0) {
        tbody.innerHTML = "";
        if (emptyState) {
            emptyState.classList.remove("hidden");
            emptyState.querySelector("h3").textContent = state.students.length === 0 ? "Belum Ada Data Siswa" : "Data Tidak Ditemukan";
            emptyState.querySelector("p").textContent = state.students.length === 0 ? 'Tambahkan siswa melalui menu "Kelola Siswa".' : "Tidak ada siswa yang sesuai filter.";
        }
    } else {
        if (emptyState) emptyState.classList.add("hidden");
        tbody.innerHTML = page.map(function(r) {
            var bc = r.status === "Lunas" ? "badge success" : (r.status === "Cicilan" ? "badge warning" : "badge danger");
            var bi = r.status === "Lunas" ? "fa-solid fa-check" : (r.status === "Cicilan" ? "fa-solid fa-clock" : "fa-solid fa-xmark");
            var pc = r.progressPercent >= 100 ? "var(--success)" : (r.progressPercent > 0 ? "var(--warning)" : "var(--danger)");
            return '<tr>' +
                '<td class="text-center"><strong>' + r.absen + '</strong></td>' +
                '<td><strong>' + r.nama + '</strong></td>' +
                '<td>' + r.kelas + '</td>' +
                '<td><div class="payment-progress"><div class="payment-progress-bar"><div class="payment-progress-fill" style="width:' + r.progressPercent + '%;background:' + pc + '"></div></div><span class="payment-progress-text">' + formatRupiah(r.totalBayar) + ' / ' + formatRupiah(KAS_CONFIG.BULANAN) + '</span></div></td>' +
                '<td><span class="' + bc + '"><i class="' + bi + '"></i> ' + r.status + '</span></td>' +
                '<td class="text-center"><div class="action-group">' +
                    (r.status !== "Lunas" ? '<button class="btn-action pay" onclick="openPaymentModal(\'' + r.id + '\')" title="Bayar Kas"><i class="fa-solid fa-money-bill-wave"></i></button>' : '') +
                    '<button class="btn-action detail" onclick="openStudentDetailModal(\'' + r.id + '\')" title="Lihat Detail"><i class="fa-solid fa-eye"></i></button>' +
                '</div></td></tr>';
        }).join("");
    }
    renderPagination(start, end, totalCount, totalPages);
    renderPrintTable(filtered);
}

function renderPagination(start, end, total, totalPages) {
    var el = function(id) { return document.getElementById(id); };
    if (el("paginationStart")) el("paginationStart").textContent = total === 0 ? "0" : String(start + 1);
    if (el("paginationEnd")) el("paginationEnd").textContent = String(end);
    if (el("paginationTotal")) el("paginationTotal").textContent = String(total);
    var nav = el("paginationNav");
    if (!nav) return;
    if (totalPages <= 1) { nav.innerHTML = ""; return; }
    var html = '<button class="page-btn" onclick="changePage(' + (state.currentPage - 1) + ')"' + (state.currentPage === 1 ? " disabled" : "") + '><i class="fa-solid fa-chevron-left"></i></button>';
    for (var i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= state.currentPage - 1 && i <= state.currentPage + 1))
            html += '<button class="page-btn' + (i === state.currentPage ? " active" : "") + '" onclick="changePage(' + i + ')">' + i + '</button>';
        else if (i === state.currentPage - 2 || i === state.currentPage + 2)
            html += '<span class="page-btn" style="border:none;background:none;">...</span>';
    }
    html += '<button class="page-btn" onclick="changePage(' + (state.currentPage + 1) + ')"' + (state.currentPage === totalPages ? " disabled" : "") + '><i class="fa-solid fa-chevron-right"></i></button>';
    nav.innerHTML = html;
}

function changePage(p) { state.currentPage = p; renderTable(); }

// ==========================================================================
// FORMAL PRINT & PDF POPULATION
// ==========================================================================

function renderPrintTable(recap) {
    var el = function(id) { return document.getElementById(id); };
    var today = new Date().toISOString().split("T")[0];
    var expenses = getExpensesForMonth(state.activeBulan);

    // Meta Header
    if (el("printPeriodeBulan")) el("printPeriodeBulan").textContent = formatBulan(state.activeBulan);
    if (el("printTanggalCetak")) el("printTanggalCetak").textContent = formatTanggal(today);
    if (el("printTtdDateLocation")) el("printTtdDateLocation").textContent = "Dibuat pada: " + formatTanggal(today);

    // Financial Summary
    var totalMasuk = recap.reduce(function(acc, r) { return acc + r.totalBayar; }, 0);
    var totalKeluar = expenses.reduce(function(acc, e) { return acc + e.nominal; }, 0);
    var totalSisa = recap.reduce(function(acc, r) { return acc + r.sisa; }, 0);
    var saldoKas = totalMasuk - totalKeluar;
    var lunasCount = recap.filter(function(r) { return r.status === "Lunas"; }).length;
    var totalSiswa = recap.length;
    var percentLunas = totalSiswa > 0 ? Math.round((lunasCount / totalSiswa) * 100) : 0;

    if (el("printTotalMasuk")) el("printTotalMasuk").textContent = formatRupiah(totalMasuk);
    if (el("printTotalKeluar")) el("printTotalKeluar").textContent = formatRupiah(totalKeluar);
    if (el("printSaldoKas")) el("printSaldoKas").textContent = formatRupiah(saldoKas);
    if (el("printLunasPercentage")) el("printLunasPercentage").textContent = percentLunas + "%";
    if (el("printSummaryPemasukanNote")) el("printSummaryPemasukanNote").textContent = "Dari total iuran siswa";
    if (el("printSummaryPengeluaranNote")) el("printSummaryPengeluaranNote").textContent = expenses.length + " transaksi belanja";
    if (el("printSummarySiswaNote")) el("printSummarySiswaNote").textContent = lunasCount + " Lunas / " + totalSiswa + " Siswa";

    // Table 1: Penerimaan Kas Siswa
    var studentTbody = el("printTableBody");
    if (studentTbody) {
        if (recap.length === 0) {
            studentTbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:1.5rem;color:#64748b;font-style:italic;">Belum ada data siswa terdaftar untuk periode ini.</td></tr>';
        } else {
            studentTbody.innerHTML = recap.map(function(r) {
                var statusClass = r.status === "Lunas" ? "print-badge-success" : (r.status === "Cicilan" ? "print-badge-warning" : "print-badge-danger");
                return '<tr>' +
                    '<td class="text-center"><strong>' + r.absen + '</strong></td>' +
                    '<td><strong>' + r.nama + '</strong></td>' +
                    '<td class="text-center">' + r.kelas + '</td>' +
                    '<td class="text-center">' + formatRupiah(KAS_CONFIG.BULANAN) + '</td>' +
                    '<td class="text-center"><strong>' + formatRupiah(r.totalBayar) + '</strong></td>' +
                    '<td class="text-center">' + (r.sisa > 0 ? formatRupiah(r.sisa) : '<span style="color:#16a34a;">Rp 0</span>') + '</td>' +
                    '<td class="text-center"><span class="print-status-badge ' + statusClass + '">' + r.status + '</span></td>' +
                '</tr>';
            }).join("");
        }
    }

    if (el("printTfootTotalBayar")) el("printTfootTotalBayar").textContent = formatRupiah(totalMasuk);
    if (el("printTfootTotalSisa")) el("printTfootTotalSisa").textContent = formatRupiah(totalSisa);
    if (el("printTfootStatus")) el("printTfootStatus").textContent = lunasCount + " / " + totalSiswa + " Lunas";

    // Table 2: Rincian Pengeluaran Kas
    var expenseTbody = el("printExpenseTableBody");
    if (expenseTbody) {
        if (expenses.length === 0) {
            expenseTbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:1.25rem;color:#64748b;font-style:italic;">(Tidak ada catatan pengeluaran operasional pada periode ini)</td></tr>';
        } else {
            expenseTbody.innerHTML = expenses.map(function(e, i) {
                return '<tr>' +
                    '<td class="text-center">' + (i + 1) + '</td>' +
                    '<td class="text-center">' + formatTanggal(e.tanggal) + '</td>' +
                    '<td><span class="print-category-pill">' + e.kategori + '</span></td>' +
                    '<td>' + (e.keterangan || "-") + '</td>' +
                    '<td class="text-center"><strong>' + formatRupiah(e.nominal) + '</strong></td>' +
                '</tr>';
            }).join("");
        }
    }

    if (el("printTfootTotalKeluar")) el("printTfootTotalKeluar").textContent = formatRupiah(totalKeluar);
}

// ==========================================================================
// 9. EXPENSE TABLE
// ==========================================================================

function getFilteredExpenses() {
    var expenses = getExpensesForMonth(state.activeBulan);
    if (state.expenseSearchQuery.trim()) {
        var q = state.expenseSearchQuery.toLowerCase();
        expenses = expenses.filter(function(e) { return (e.keterangan && e.keterangan.toLowerCase().includes(q)) || (e.kategori && e.kategori.toLowerCase().includes(q)); });
    }
    if (state.expenseCategoryFilter !== "ALL") expenses = expenses.filter(function(e) { return e.kategori === state.expenseCategoryFilter; });
    expenses.sort(function(a, b) { return new Date(b.tanggal) - new Date(a.tanggal); });
    return expenses;
}

function renderExpenseTable() {
    var tbody = document.getElementById("expenseTableBody");
    var emptyState = document.getElementById("expenseEmptyState");
    if (!tbody) return;
    var filtered = getFilteredExpenses();

    if (filtered.length === 0) {
        tbody.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
    } else {
        if (emptyState) emptyState.classList.add("hidden");
        tbody.innerHTML = filtered.map(function(e, i) {
            var catIcon = { "Alat Tulis": "fa-pen", "Fotokopi": "fa-copy", "Konsumsi": "fa-utensils", "Kegiatan Kelas": "fa-people-group", "Kebersihan": "fa-broom", "Lain-lain": "fa-ellipsis" };
            var icon = catIcon[e.kategori] || "fa-tag";
            return '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + formatTanggal(e.tanggal) + '</td>' +
                '<td><span class="badge-category"><i class="fa-solid ' + icon + '"></i> ' + e.kategori + '</span></td>' +
                '<td>' + (e.keterangan || "-") + '</td>' +
                '<td><strong class="text-danger-val">' + formatRupiah(e.nominal) + '</strong></td>' +
                '<td class="text-center"><div class="action-group">' +
                    '<button class="btn-action edit" onclick="openEditExpenseModal(\'' + e.id + '\')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>' +
                    '<button class="btn-action delete" onclick="confirmDeleteExpense(\'' + e.id + '\')" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>' +
                '</div></td></tr>';
        }).join("");
    }

    var monthTotal = filtered.reduce(function(s, e) { return s + e.nominal; }, 0);
    var el = document.getElementById("expenseMonthTotal");
    if (el) el.textContent = formatRupiah(monthTotal);
}

// ==========================================================================
// 10. TAB SWITCHING
// ==========================================================================

function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll(".tab-btn").forEach(function(btn) {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    document.getElementById("tabContentKasMasuk").classList.toggle("active", tabName === "kasmasuk");
    document.getElementById("tabContentPengeluaran").classList.toggle("active", tabName === "pengeluaran");
}

// ==========================================================================
// 11. STUDENT CRUD
// ==========================================================================

function openStudentModal() {
    state.editingStudentId = null;
    var form = document.getElementById("studentForm");
    if (form) form.reset();
    var btn = document.getElementById("saveStudentBtn");
    if (btn) btn.innerHTML = '<i class="fa-solid fa-plus"></i> Tambah Siswa';
    renderStudentListInModal();
    clearValidations("studentForm");
    openModal("studentModal");
}

function renderStudentListInModal() {
    var listBody = document.getElementById("studentListBody");
    if (!listBody) return;
    if (state.students.length === 0) {
        listBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem;"><i class="fa-solid fa-user-plus" style="font-size:1.5rem;margin-bottom:0.5rem;display:block;opacity:0.5;"></i>Belum ada siswa terdaftar.</td></tr>';
        return;
    }
    listBody.innerHTML = state.students.map(function(s) {
        return '<tr><td class="text-center"><strong>' + s.absen + '</strong></td><td><strong>' + s.nama + '</strong></td><td>' + s.kelas + '</td>' +
            '<td class="text-center"><div class="action-group">' +
            '<button class="btn-action edit" onclick="editStudent(\'' + s.id + '\')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>' +
            '<button class="btn-action delete" onclick="confirmDeleteStudent(\'' + s.id + '\')" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>' +
            '</div></td></tr>';
    }).join("");
}

function handleStudentFormSubmit(e) {
    e.preventDefault();
    var nama = document.getElementById("studentNama");
    var kelas = document.getElementById("studentKelas");
    var absen = document.getElementById("studentAbsen");
    var valid = true;
    if (!nama.value.trim()) { nama.classList.add("is-invalid"); valid = false; } else nama.classList.remove("is-invalid");
    if (!kelas.value.trim()) { kelas.classList.add("is-invalid"); valid = false; } else kelas.classList.remove("is-invalid");
    var absenVal = parseInt(absen.value, 10);
    if (isNaN(absenVal) || absenVal <= 0) { absen.classList.add("is-invalid"); valid = false; } else absen.classList.remove("is-invalid");
    if (!valid) { showToast("Validasi Gagal", "Periksa inputan Anda.", "warning"); return; }

    if (state.editingStudentId) {
        var idx = state.students.findIndex(function(s) { return s.id === state.editingStudentId; });
        if (idx !== -1) { state.students[idx] = { id: state.editingStudentId, nama: nama.value.trim(), kelas: kelas.value.trim(), absen: absenVal }; }
        showToast("Diperbarui", nama.value.trim() + " berhasil diperbarui.", "success");
        state.editingStudentId = null;
        document.getElementById("saveStudentBtn").innerHTML = '<i class="fa-solid fa-plus"></i> Tambah Siswa';
    } else {
        var newS = { id: generateId("STD", state.students), nama: nama.value.trim(), kelas: kelas.value.trim(), absen: absenVal };
        state.students.push(newS);
        showToast("Ditambahkan", newS.nama + " berhasil ditambahkan.", "success");
    }
    saveStateToStorage();
    renderStudentListInModal();
    refreshAll();
    document.getElementById("studentForm").reset();
}

function editStudent(id) {
    var s = getStudentById(id);
    if (!s) return;
    state.editingStudentId = id;
    document.getElementById("studentNama").value = s.nama;
    document.getElementById("studentKelas").value = s.kelas;
    document.getElementById("studentAbsen").value = s.absen;
    document.getElementById("saveStudentBtn").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Siswa';
    clearValidations("studentForm");
}

function confirmDeleteStudent(id) {
    var s = getStudentById(id);
    if (!s) return;
    state.deletingType = "student";
    state.deletingId = id;
    var related = state.payments.filter(function(p) { return p.studentId === id; });
    var infoBox = document.getElementById("deleteInfoBox");
    if (infoBox) infoBox.innerHTML = '<strong>' + s.nama + '</strong> (' + s.kelas + ', Absen: ' + s.absen + ')' +
        (related.length > 0 ? '<br><span style="color:var(--warning);"><i class="fa-solid fa-triangle-exclamation"></i> ' + related.length + ' pembayaran terkait juga akan dihapus.</span>' : '');
    openModal("deleteModal");
}

// ==========================================================================
// 12. PAYMENT CRUD
// ==========================================================================

function populateStudentDropdown() {
    var sel = document.getElementById("paymentStudentSelect");
    if (!sel) return;
    var val = sel.value;
    sel.innerHTML = '<option value="">-- Pilih Siswa --</option>';
    state.students.sort(function(a, b) { return a.absen - b.absen; }).forEach(function(s) {
        var opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.absen + " - " + s.nama + " (" + s.kelas + ")";
        sel.appendChild(opt);
    });
    if (val) sel.value = val;
}

function getConsecutiveMonths(startMonthStr, count) {
    var result = [];
    if (!startMonthStr || !startMonthStr.includes("-")) return result;
    var parts = startMonthStr.split("-");
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    for (var i = 0; i < count; i++) {
        var m = month + i;
        var y = year + Math.floor((m - 1) / 12);
        var remMonth = ((m - 1) % 12) + 1;
        result.push(y + "-" + String(remMonth).padStart(2, "0"));
    }
    return result;
}

function updateMultiBulanPreview() {
    var startMonth = document.getElementById("paymentBulan").value || state.activeBulan;
    var count = parseInt(document.getElementById("paymentMultiBulanCount").value, 10) || 2;
    var months = getConsecutiveMonths(startMonth, count);
    var previewList = document.getElementById("multiBulanPreviewList");
    if (previewList) {
        previewList.innerHTML = months.map(function(m, idx) {
            return '<span class="month-pill-badge"><i class="fa-regular fa-calendar-check"></i> ' + (idx + 1) + '. ' + formatBulan(m) + '</span>';
        }).join("");
    }
    var totalNominal = count * KAS_CONFIG.BULANAN;
    var display = document.getElementById("paymentNominalDisplay");
    if (display) display.textContent = formatRupiah(totalNominal);
}

function updateCustomNominalDisplay() {
    var input = document.getElementById("paymentCustomNominal");
    var display = document.getElementById("paymentNominalDisplay");
    var val = input ? parseInt(input.value, 10) : 0;
    if (display) display.textContent = formatRupiah(isNaN(val) || val <= 0 ? 0 : val);
}

function handlePaymentTipeChange() {
    var tipe = document.getElementById("paymentTipe").value;
    var mingguGroup = document.getElementById("mingguGroup");
    var multiBulanGroup = document.getElementById("multiBulanCountGroup");
    var multiBulanPreview = document.getElementById("multiBulanPreviewGroup");
    var customGroup = document.getElementById("customNominalGroup");
    var bulanLabel = document.getElementById("paymentBulanLabel");
    var display = document.getElementById("paymentNominalDisplay");

    if (mingguGroup) mingguGroup.style.display = (tipe === "mingguan") ? "" : "none";
    if (multiBulanGroup) multiBulanGroup.style.display = (tipe === "multi_bulan") ? "" : "none";
    if (multiBulanPreview) multiBulanPreview.style.display = (tipe === "multi_bulan") ? "" : "none";
    if (customGroup) customGroup.style.display = (tipe === "kustom") ? "" : "none";

    if (bulanLabel) {
        bulanLabel.innerHTML = (tipe === "multi_bulan") ? 'Bulan Mulai <span class="required">*</span>' : 'Bulan <span class="required">*</span>';
    }

    if (tipe === "mingguan") {
        if (display) display.textContent = formatRupiah(KAS_CONFIG.MINGGUAN);
        updateMingguOptions();
    } else if (tipe === "bulanan") {
        if (display) display.textContent = formatRupiah(KAS_CONFIG.BULANAN);
    } else if (tipe === "multi_bulan") {
        updateMultiBulanPreview();
    } else if (tipe === "kustom") {
        updateCustomNominalDisplay();
    }
}

function openPaymentModal(studentId) {
    var form = document.getElementById("paymentForm");
    if (form) form.reset();
    populateStudentDropdown();
    if (studentId) document.getElementById("paymentStudentSelect").value = studentId;
    document.getElementById("paymentBulan").value = state.activeBulan;
    document.getElementById("paymentTanggal").value = new Date().toISOString().split("T")[0];
    document.getElementById("paymentTipe").value = "mingguan";
    document.getElementById("paymentNominalDisplay").textContent = formatRupiah(KAS_CONFIG.MINGGUAN);
    handlePaymentTipeChange();
    clearValidations("paymentForm");
    openModal("paymentModal");
}

function updateMingguOptions() {
    var sel = document.getElementById("paymentMinggu");
    var studentSel = document.getElementById("paymentStudentSelect");
    var bulan = document.getElementById("paymentBulan");
    var tipe = document.getElementById("paymentTipe");
    if (!sel || !studentSel || !bulan || !tipe) return;
    sel.innerHTML = "";
    if (tipe.value !== "mingguan") return;
    var paidWeeks = studentSel.value ? getPaidWeeksForMonth(studentSel.value, bulan.value) : [];
    for (var w = 1; w <= 4; w++) {
        var opt = document.createElement("option");
        opt.value = w;
        opt.textContent = "Minggu ke-" + w;
        if (paidWeeks.includes(w)) { opt.disabled = true; opt.textContent += " (Sudah Bayar)"; }
        sel.appendChild(opt);
    }
    for (var w2 = 1; w2 <= 4; w2++) { if (!paidWeeks.includes(w2)) { sel.value = w2; break; } }
}

function handlePaymentFormSubmit(e) {
    e.preventDefault();
    var studentSel = document.getElementById("paymentStudentSelect");
    var bulan = document.getElementById("paymentBulan");
    var tanggal = document.getElementById("paymentTanggal");
    var tipe = document.getElementById("paymentTipe");
    var minggu = document.getElementById("paymentMinggu");
    var multiCount = document.getElementById("paymentMultiBulanCount");
    var customNominal = document.getElementById("paymentCustomNominal");
    var ket = document.getElementById("paymentKeterangan");
    var valid = true;

    if (!studentSel.value) { studentSel.classList.add("is-invalid"); valid = false; } else studentSel.classList.remove("is-invalid");
    if (!bulan.value) { bulan.classList.add("is-invalid"); valid = false; } else bulan.classList.remove("is-invalid");
    if (!tanggal.value) { tanggal.classList.add("is-invalid"); valid = false; } else tanggal.classList.remove("is-invalid");

    var student = getStudentById(studentSel.value);
    var studentName = student ? student.nama : "Siswa";

    if (tipe.value === "kustom") {
        var cNom = parseInt(customNominal.value, 10);
        if (isNaN(cNom) || cNom <= 0) {
            customNominal.classList.add("is-invalid");
            valid = false;
        } else {
            customNominal.classList.remove("is-invalid");
        }
        if (!valid) { showToast("Validasi Gagal", "Masukkan nominal kustom yang valid.", "warning"); return; }

        var autoKet = "Cicilan Kas " + formatRupiah(cNom) + " (" + formatBulan(bulan.value) + ")";
        state.payments.push({
            id: generateId("PAY", state.payments),
            studentId: studentSel.value,
            nominal: cNom,
            tanggal: tanggal.value,
            bulan: bulan.value,
            tipe: "kustom",
            mingguKe: null,
            keterangan: ket.value.trim() || autoKet
        });

        saveStateToStorage();
        refreshAll();
        showToast("Pembayaran Dicatat", studentName + " - " + formatRupiah(cNom) + " (" + formatBulan(bulan.value) + ")", "success");
        closeModal("paymentModal");
        return;
    }

    if (tipe.value === "multi_bulan") {
        if (!valid) { showToast("Validasi Gagal", "Periksa inputan Anda.", "warning"); return; }
        var count = parseInt(multiCount.value, 10) || 2;
        var months = getConsecutiveMonths(bulan.value, count);
        var totalPkgNominal = count * KAS_CONFIG.BULANAN;

        months.forEach(function(m) {
            var autoKet = "Bayar di Muka Paket " + count + " Bulan (" + formatBulan(m) + ")";
            state.payments.push({
                id: generateId("PAY", state.payments),
                studentId: studentSel.value,
                nominal: KAS_CONFIG.BULANAN,
                tanggal: tanggal.value,
                bulan: m,
                tipe: "bulanan",
                mingguKe: null,
                keterangan: ket.value.trim() || autoKet
            });
        });

        saveStateToStorage();
        refreshAll();
        showToast("Paket Multi-Bulan Berhasil", studentName + " - " + count + " Bulan (" + formatRupiah(totalPkgNominal) + ") Lunas.", "success");
        closeModal("paymentModal");
        return;
    }

    if (tipe.value === "bulanan") {
        if (!valid) { showToast("Validasi Gagal", "Periksa inputan Anda.", "warning"); return; }
        var currentTotal = getStudentTotalForMonth(studentSel.value, bulan.value);
        if (currentTotal >= KAS_CONFIG.BULANAN) {
            showToast("Sudah Lunas", studentName + " sudah lunas untuk bulan " + formatBulan(bulan.value) + ".", "warning");
            return;
        }
        var nominal = KAS_CONFIG.BULANAN;
        var autoKet = "Kas Bulanan " + formatBulan(bulan.value);
        state.payments.push({
            id: generateId("PAY", state.payments),
            studentId: studentSel.value,
            nominal: nominal,
            tanggal: tanggal.value,
            bulan: bulan.value,
            tipe: "bulanan",
            mingguKe: null,
            keterangan: ket.value.trim() || autoKet
        });

        saveStateToStorage();
        refreshAll();
        showToast("Pembayaran Dicatat", studentName + " - " + formatRupiah(nominal) + " (" + formatBulan(bulan.value) + ")", "success");
        closeModal("paymentModal");
        return;
    }

    // Mingguan
    if (!valid) { showToast("Validasi Gagal", "Periksa inputan Anda.", "warning"); return; }
    var mingguKe = parseInt(minggu.value, 10);
    var currentTotal = getStudentTotalForMonth(studentSel.value, bulan.value);
    if (currentTotal >= KAS_CONFIG.BULANAN) {
        showToast("Sudah Lunas", studentName + " sudah lunas bulan " + formatBulan(bulan.value) + ".", "warning");
        return;
    }
    if (getPaidWeeksForMonth(studentSel.value, bulan.value).includes(mingguKe)) {
        showToast("Sudah Dibayar", "Minggu ke-" + mingguKe + " bulan " + formatBulan(bulan.value) + " sudah dibayar.", "warning");
        return;
    }

    var nominal = KAS_CONFIG.MINGGUAN;
    var autoKet = "Kas Minggu ke-" + mingguKe + " " + formatBulan(bulan.value);
    state.payments.push({
        id: generateId("PAY", state.payments),
        studentId: studentSel.value,
        nominal: nominal,
        tanggal: tanggal.value,
        bulan: bulan.value,
        tipe: "mingguan",
        mingguKe: mingguKe,
        keterangan: ket.value.trim() || autoKet
    });

    saveStateToStorage();
    refreshAll();
    showToast("Pembayaran Dicatat", studentName + " - Minggu ke-" + mingguKe + " (" + formatRupiah(nominal) + ")", "success");
    closeModal("paymentModal");
}

// ==========================================================================
// 13. EXPENSE CRUD
// ==========================================================================

function openExpenseModal() {
    state.editingExpenseId = null;
    var form = document.getElementById("expenseForm");
    if (form) form.reset();
    document.getElementById("expenseTanggal").value = new Date().toISOString().split("T")[0];
    clearValidations("expenseForm");
    openModal("expenseModal");
}

function openEditExpenseModal(id) {
    var exp = state.expenses.find(function(e) { return e.id === id; });
    if (!exp) return;
    state.editingExpenseId = id;
    document.getElementById("expenseKategori").value = exp.kategori;
    document.getElementById("expenseNominal").value = exp.nominal;
    document.getElementById("expenseTanggal").value = exp.tanggal;
    document.getElementById("expenseKeterangan").value = exp.keterangan || "";
    clearValidations("expenseForm");
    openModal("expenseModal");
}

function handleExpenseFormSubmit(e) {
    e.preventDefault();
    var kategori = document.getElementById("expenseKategori");
    var nominal = document.getElementById("expenseNominal");
    var tanggal = document.getElementById("expenseTanggal");
    var keterangan = document.getElementById("expenseKeterangan");
    var valid = true;
    if (!kategori.value) { kategori.classList.add("is-invalid"); valid = false; } else kategori.classList.remove("is-invalid");
    var nomVal = Number(nominal.value);
    if (isNaN(nomVal) || nomVal <= 0) { nominal.classList.add("is-invalid"); valid = false; } else nominal.classList.remove("is-invalid");
    if (!tanggal.value) { tanggal.classList.add("is-invalid"); valid = false; } else tanggal.classList.remove("is-invalid");
    if (!keterangan.value.trim()) { keterangan.classList.add("is-invalid"); valid = false; } else keterangan.classList.remove("is-invalid");
    if (!valid) { showToast("Validasi Gagal", "Periksa inputan.", "warning"); return; }

    var bulan = tanggal.value.substring(0, 7);

    if (state.editingExpenseId) {
        var idx = state.expenses.findIndex(function(ex) { return ex.id === state.editingExpenseId; });
        if (idx !== -1) {
            state.expenses[idx] = { id: state.editingExpenseId, kategori: kategori.value, nominal: nomVal, tanggal: tanggal.value, bulan: bulan, keterangan: keterangan.value.trim() };
        }
        showToast("Diperbarui", "Pengeluaran berhasil diperbarui.", "success");
        state.editingExpenseId = null;
    } else {
        state.expenses.push({ id: generateId("EXP", state.expenses), kategori: kategori.value, nominal: nomVal, tanggal: tanggal.value, bulan: bulan, keterangan: keterangan.value.trim() });
        showToast("Pengeluaran Dicatat", kategori.value + " - " + formatRupiah(nomVal), "info");
    }
    saveStateToStorage();
    refreshAll();
    closeModal("expenseModal");
}

function confirmDeleteExpense(id) {
    var exp = state.expenses.find(function(e) { return e.id === id; });
    if (!exp) return;
    state.deletingType = "expense";
    state.deletingId = id;
    var infoBox = document.getElementById("deleteInfoBox");
    if (infoBox) infoBox.innerHTML = '<strong>' + exp.kategori + '</strong><br>' + exp.keterangan + '<br>Nominal: ' + formatRupiah(exp.nominal);
    openModal("deleteModal");
}

// ==========================================================================
// 14. STUDENT DETAIL MODAL
// ==========================================================================

function openStudentDetailModal(studentId) {
    var student = getStudentById(studentId);
    if (!student) return;
    var payments = getStudentPaymentsForMonth(studentId, state.activeBulan);
    var totalBayar = getStudentTotalForMonth(studentId, state.activeBulan);
    var sisa = Math.max(0, KAS_CONFIG.BULANAN - totalBayar);
    var status = getStudentStatusForMonth(studentId, state.activeBulan);
    var titleEl = document.getElementById("detailModalTitle");
    if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-user"></i> ' + student.nama;

    var bodyEl = document.getElementById("detailModalBody");
    if (!bodyEl) return;

    var bc = status === "Lunas" ? "badge success" : (status === "Cicilan" ? "badge warning" : "badge danger");
    var bi = status === "Lunas" ? "fa-solid fa-check" : (status === "Cicilan" ? "fa-solid fa-clock" : "fa-solid fa-xmark");
    var pp = Math.min(100, Math.round((totalBayar / KAS_CONFIG.BULANAN) * 100));
    var pc = pp >= 100 ? "var(--success)" : (pp > 0 ? "var(--warning)" : "var(--danger)");

    var rows = payments.length === 0
        ? '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:1.5rem;">Belum ada pembayaran.</td></tr>'
        : payments.map(function(p) {
            return '<tr><td>' + formatTanggal(p.tanggal) + '</td><td>' + (p.tipe === "bulanan" ? "Bulanan" : "Minggu ke-" + p.mingguKe) + '</td><td><strong>' + formatRupiah(p.nominal) + '</strong></td><td>' + (p.keterangan || "-") + '</td>' +
                '<td class="text-center"><button class="btn-action delete" onclick="deletePaymentFromDetail(\'' + p.id + '\',\'' + studentId + '\')" title="Hapus"><i class="fa-solid fa-trash-can"></i></button></td></tr>';
          }).join("");

    bodyEl.innerHTML =
        '<div class="detail-summary"><div class="detail-info-row">' +
        '<div class="detail-info-item"><span class="detail-label">Kelas</span><span class="detail-value">' + student.kelas + '</span></div>' +
        '<div class="detail-info-item"><span class="detail-label">No. Absen</span><span class="detail-value">' + student.absen + '</span></div>' +
        '<div class="detail-info-item"><span class="detail-label">Periode</span><span class="detail-value">' + formatBulan(state.activeBulan) + '</span></div>' +
        '<div class="detail-info-item"><span class="detail-label">Status</span><span class="' + bc + '"><i class="' + bi + '"></i> ' + status + '</span></div>' +
        '</div><div class="detail-progress-section"><div class="payment-progress" style="margin-top:0.5rem;"><div class="payment-progress-bar" style="height:12px;"><div class="payment-progress-fill" style="width:' + pp + '%;background:' + pc + '"></div></div>' +
        '<span class="payment-progress-text" style="font-size:0.9rem;font-weight:600;">' + formatRupiah(totalBayar) + ' / ' + formatRupiah(KAS_CONFIG.BULANAN) + (sisa > 0 ? ' (Sisa: ' + formatRupiah(sisa) + ')' : '') + '</span></div></div></div>' +
        '<h4 style="margin:1.25rem 0 0.75rem;font-size:0.95rem;"><i class="fa-solid fa-receipt" style="color:var(--primary);margin-right:0.5rem;"></i>Riwayat Pembayaran</h4>' +
        '<div class="table-responsive" style="min-height:auto;"><table class="data-table"><thead><tr><th>Tanggal</th><th>Tipe</th><th>Nominal</th><th>Keterangan</th><th class="text-center">Aksi</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    openModal("detailModal");
}

function deletePaymentFromDetail(paymentId, studentId) {
    state.payments = state.payments.filter(function(p) { return p.id !== paymentId; });
    saveStateToStorage();
    showToast("Dihapus", "Pembayaran dihapus.", "info");
    refreshAll();
    openStudentDetailModal(studentId);
}

// ==========================================================================
// 15. DELETE CONFIRMATION
// ==========================================================================

function confirmDelete() {
    if (!state.deletingId) return;
    if (state.deletingType === "student") {
        var idx = state.students.findIndex(function(s) { return s.id === state.deletingId; });
        if (idx !== -1) {
            var name = state.students[idx].nama;
            state.students.splice(idx, 1);
            state.payments = state.payments.filter(function(p) { return p.studentId !== state.deletingId; });
            showToast("Dihapus", name + " dan data terkait dihapus.", "info");
        }
    } else if (state.deletingType === "expense") {
        state.expenses = state.expenses.filter(function(e) { return e.id !== state.deletingId; });
        showToast("Dihapus", "Pengeluaran dihapus.", "info");
    }
    state.deletingType = null;
    state.deletingId = null;
    saveStateToStorage();
    refreshAll();
    renderStudentListInModal();
    closeModal("deleteModal");
}

// ==========================================================================
// 16. MODAL HELPERS
// ==========================================================================

function openModal(id) { var m = document.getElementById(id); if (m) m.classList.add("active"); }
function closeModal(id) { var m = document.getElementById(id); if (m) m.classList.remove("active"); }
function clearValidations(formId) { document.querySelectorAll("#" + formId + " .form-control, #" + formId + " select").forEach(function(el) { el.classList.remove("is-invalid"); }); }

function refreshAll() {
    updateDashboardStats();
    renderCharts();
    renderTable();
    renderExpenseTable();
    populateStudentDropdown();
}

// ==========================================================================
// 17. EXPORT & IMPORT
// ==========================================================================

function exportToCSV() {
    var recap = getMonthlyRecap(state.activeBulan);
    if (recap.length === 0) { showToast("Peringatan", "Tidak ada data.", "warning"); return; }
    var headers = ["No. Absen", "Nama Siswa", "Kelas", "Total Bayar", "Sisa", "Status"];
    var rows = recap.map(function(r) { return [r.absen, '"' + r.nama + '"', '"' + r.kelas + '"', r.totalBayar, r.sisa, '"' + r.status + '"']; });
    var csv = "data:text/csv;charset=utf-8," + [headers.join(",")].concat(rows.map(function(r) { return r.join(","); })).join("\n");
    var link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "rekap-kas-" + state.activeBulan + ".csv";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast("Export CSV", "Berhasil.", "success");
}

function exportToJSON() {
    var data = { version: 2, exportDate: new Date().toISOString(), students: state.students, payments: state.payments, expenses: state.expenses };
    var str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    var a = document.createElement("a");
    a.href = str; a.download = "backup-gokas-" + new Date().toISOString().split("T")[0] + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    showToast("Export JSON", "Berhasil.", "success");
}

function exportToPDF() {
    var recap = getMonthlyRecap(state.activeBulan);
    var expenses = getExpensesForMonth(state.activeBulan);
    if (recap.length === 0 && expenses.length === 0) {
        showToast("Peringatan", "Tidak ada data untuk di-export ke PDF.", "warning");
        return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast("Error", "Library jsPDF belum siap.", "error");
        return;
    }

    var doc = new window.jspdf.jsPDF("p", "mm", "a4");
    var today = new Date().toISOString().split("T")[0];
    var totalMasuk = recap.reduce(function(acc, r) { return acc + r.totalBayar; }, 0);
    var totalKeluar = expenses.reduce(function(acc, e) { return acc + e.nominal; }, 0);
    var saldo = totalMasuk - totalKeluar;
    var lunasCount = recap.filter(function(r) { return r.status === "Lunas"; }).length;

    // Header Kop
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);
    doc.text("GOKAS • SISTEM MONITORING KEUANGAN KAS KELAS", 105, 14, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("LAPORAN PERTANGGUNGJAWABAN KAS KELAS", 105, 22, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Periode: " + formatBulan(state.activeBulan) + "   |   Target Iuran: Rp 20.000 / Siswa   |   Tanggal Cetak: " + formatTanggal(today), 105, 27, { align: "center" });

    // Double divider line
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.6);
    doc.line(14, 30, 196, 30);
    doc.setLineWidth(0.2);
    doc.line(14, 31, 196, 31);

    // Summary Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, 34, 182, 14, 2, 2, "FD");

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("PEMASUKAN:", 18, 39);
    doc.text("PENGELUARAN:", 64, 39);
    doc.text("SALDO KAS:", 110, 39);
    doc.text("KELUNASAN:", 156, 39);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(21, 128, 61);
    doc.text(formatRupiah(totalMasuk), 18, 45);

    doc.setTextColor(185, 28, 28);
    doc.text(formatRupiah(totalKeluar), 64, 45);

    doc.setTextColor(37, 99, 235);
    doc.text(formatRupiah(saldo), 110, 45);

    doc.setTextColor(15, 23, 42);
    var pct = recap.length > 0 ? Math.round((lunasCount / recap.length) * 100) : 0;
    doc.text(lunasCount + "/" + recap.length + " (" + pct + "%)", 156, 45);

    // Table 1: Penerimaan Kas Siswa
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text("I. REKAPITULASI PENERIMAAN IURAN SISWA", 14, 54);

    var studentHeaders = [["No. Absen", "Nama Siswa", "Kelas", "Target", "Dibayar", "Sisa", "Status"]];
    var studentBody = recap.map(function(r) {
        return [
            r.absen,
            r.nama,
            r.kelas,
            formatRupiah(KAS_CONFIG.BULANAN),
            formatRupiah(r.totalBayar),
            formatRupiah(r.sisa),
            r.status
        ];
    });

    doc.autoTable({
        head: studentHeaders,
        body: studentBody,
        startY: 57,
        theme: "grid",
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 7.5, halign: "center", fontStyle: "bold" },
        styles: { fontSize: 7.5, font: "helvetica", cellPadding: 1.5 },
        columnStyles: {
            0: { halign: "center", cellWidth: 16 },
            1: { cellWidth: 54 },
            2: { halign: "center", cellWidth: 24 },
            3: { halign: "right", cellWidth: 24 },
            4: { halign: "right", cellWidth: 24, fontStyle: "bold" },
            5: { halign: "right", cellWidth: 22 },
            6: { halign: "center", cellWidth: 18 }
        },
        alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    var finalY = doc.lastAutoTable.finalY + 6;

    if (finalY > 230) {
        doc.addPage();
        finalY = 16;
    }

    // Table 2: Rincian Pengeluaran
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text("II. RINCIAN PENGELUARAN & BELANJA KELAS", 14, finalY);

    var expenseHeaders = [["No", "Tanggal", "Kategori", "Keterangan", "Nominal"]];
    var expenseBody = expenses.length === 0
        ? [["-", "-", "-", "Tidak ada catatan pengeluaran pada periode ini", "Rp 0"]]
        : expenses.map(function(e, i) {
            return [
                i + 1,
                formatTanggal(e.tanggal),
                e.kategori,
                e.keterangan || "-",
                formatRupiah(e.nominal)
            ];
        });

    doc.autoTable({
        head: expenseHeaders,
        body: expenseBody,
        startY: finalY + 3,
        theme: "grid",
        headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontSize: 7.5, halign: "center", fontStyle: "bold" },
        styles: { fontSize: 7.5, font: "helvetica", cellPadding: 1.5 },
        columnStyles: {
            0: { halign: "center", cellWidth: 10 },
            1: { halign: "center", cellWidth: 24 },
            2: { cellWidth: 32 },
            3: { cellWidth: 86 },
            4: { halign: "right", cellWidth: 30, fontStyle: "bold" }
        },
        alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    var sigY = doc.lastAutoTable.finalY + 12;
    if (sigY > 250) {
        doc.addPage();
        sigY = 20;
    }

    // Signature Block
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Dicetak pada: " + formatTanggal(today), 196, sigY - 4, { align: "right" });

    doc.text("Mengetahui / Menyetujui,", 35, sigY, { align: "center" });
    doc.text("Dilaporkan oleh,", 165, sigY, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Wali Kelas", 35, sigY + 4, { align: "center" });
    doc.text("Bendahara Kelas", 165, sigY + 4, { align: "center" });

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.3);
    doc.line(15, sigY + 22, 55, sigY + 22);
    doc.line(145, sigY + 22, 185, sigY + 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("NIP. .....................................", 35, sigY + 26, { align: "center" });
    doc.text("NIS / No. Absen: .................", 165, sigY + 26, { align: "center" });

    doc.save("laporan-kas-kelas-" + state.activeBulan + ".pdf");
    showToast("Export PDF", "Laporan PDF resmi berhasil diunduh.", "success");
}

function handleFileSelect(e) {
    var file = e.target.files[0];
    if (!file) return;
    var preview = document.getElementById("fileNamePreview");
    var confirmBtn = document.getElementById("confirmImportBtn");
    if (preview) preview.textContent = file.name;
    var reader = new FileReader();
    reader.onload = function(evt) {
        try {
            var parsed = JSON.parse(evt.target.result);
            if (parsed.version === 2 && Array.isArray(parsed.students) && Array.isArray(parsed.payments)) {
                state.pendingImportData = parsed;
                if (confirmBtn) confirmBtn.disabled = false;
            } else { showToast("Format Salah", "Bukan format GoKas v2.", "error"); if (confirmBtn) confirmBtn.disabled = true; }
        } catch (err) { showToast("Error", "File bukan JSON valid.", "error"); if (confirmBtn) confirmBtn.disabled = true; }
    };
    reader.readAsText(file);
}

function confirmImport() {
    if (!state.pendingImportData) return;
    state.students = state.pendingImportData.students || [];
    state.payments = state.pendingImportData.payments || [];
    state.expenses = state.pendingImportData.expenses || [];
    state.pendingImportData = null;
    saveStateToStorage(); refreshAll();
    closeModal("importModal");
    showToast("Import Berhasil", state.students.length + " siswa, " + state.payments.length + " pembayaran, " + state.expenses.length + " pengeluaran.", "success");
}

// ==========================================================================
// 18. MONTH NAVIGATION
// ==========================================================================

function changeMonth(direction) {
    var parts = state.activeBulan.split("-");
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) + direction;
    if (month < 1) { month = 12; year--; }
    if (month > 12) { month = 1; year++; }
    state.activeBulan = year + "-" + String(month).padStart(2, "0");
    state.currentPage = 1;
    syncBulanFilters();
    refreshAll();
}

function syncBulanFilters() {
    var bf = document.getElementById("bulanFilter");
    var ef = document.getElementById("expenseBulanFilter");
    if (bf) bf.value = state.activeBulan;
    if (ef) ef.value = state.activeBulan;
}

// ==========================================================================
// 19. EVENT LISTENERS
// ==========================================================================

document.addEventListener("DOMContentLoaded", function() {
    loadStateFromStorage();
    applyTheme(state.theme);
    syncBulanFilters();
    refreshAll();

    // Date
    var dateText = document.getElementById("currentDateText");
    if (dateText) dateText.textContent = formatTanggal(new Date().toISOString().split("T")[0]);

    // Theme
    var themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) themeBtn.addEventListener("click", function() {
        var t = state.theme === "light" ? "dark" : "light";
        applyTheme(t);
        showToast("Tema", "Mode " + (t === "dark" ? "Gelap" : "Terang") + " aktif.", "info");
    });

    // Sidebar Toggle
    var toggleBtn = document.getElementById("toggleSidebarBtn");
    var closeBtn = document.getElementById("mobileCloseBtn");
    var sidebar = document.getElementById("sidebar");
    var backdrop = document.getElementById("sidebarBackdrop");
    var appLayout = document.querySelector(".app-layout");

    function toggleSidebar() {
        if (window.innerWidth <= 1024) {
            if (sidebar) sidebar.classList.toggle("active");
            if (backdrop) backdrop.classList.toggle("active");
        } else {
            if (appLayout) appLayout.classList.toggle("sidebar-collapsed");
        }
    }

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove("active");
        if (backdrop) backdrop.classList.remove("active");
    }

    if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeMobileSidebar);
    if (backdrop) backdrop.addEventListener("click", closeMobileSidebar);

    // Auto-close mobile sidebar when clicking menu items
    document.querySelectorAll(".sidebar-menu a, .sidebar-menu button").forEach(function(el) {
        el.addEventListener("click", function() {
            if (window.innerWidth <= 1024) closeMobileSidebar();
        });
    });

    // Tabs
    document.querySelectorAll(".tab-btn").forEach(function(btn) {
        btn.addEventListener("click", function() { switchTab(btn.dataset.tab); });
    });

    // Kas Masuk filters
    var searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.addEventListener("input", function(e) { state.searchQuery = e.target.value; state.currentPage = 1; renderTable(); });

    var statusFilter = document.getElementById("statusFilter");
    if (statusFilter) statusFilter.addEventListener("change", function(e) { state.statusFilter = e.target.value; state.currentPage = 1; renderTable(); });

    var sortSelect = document.getElementById("sortSelect");
    if (sortSelect) sortSelect.addEventListener("change", function(e) { state.sortBy = e.target.value; renderTable(); });

    var pageSizeSelect = document.getElementById("pageSizeSelect");
    if (pageSizeSelect) pageSizeSelect.addEventListener("change", function(e) { state.pageSize = parseInt(e.target.value, 10); state.currentPage = 1; renderTable(); });

    // Month navigation (Kas Masuk)
    var bulanFilter = document.getElementById("bulanFilter");
    if (bulanFilter) bulanFilter.addEventListener("change", function(e) { state.activeBulan = e.target.value; syncBulanFilters(); state.currentPage = 1; refreshAll(); });
    var prevBtn = document.getElementById("prevMonthBtn");
    var nextBtn = document.getElementById("nextMonthBtn");
    if (prevBtn) prevBtn.addEventListener("click", function() { changeMonth(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function() { changeMonth(1); });

    // Month navigation (Pengeluaran)
    var expBulanFilter = document.getElementById("expenseBulanFilter");
    if (expBulanFilter) expBulanFilter.addEventListener("change", function(e) { state.activeBulan = e.target.value; syncBulanFilters(); refreshAll(); });
    var expPrev = document.getElementById("expPrevMonthBtn");
    var expNext = document.getElementById("expNextMonthBtn");
    if (expPrev) expPrev.addEventListener("click", function() { changeMonth(-1); });
    if (expNext) expNext.addEventListener("click", function() { changeMonth(1); });

    // Expense filters
    var expSearch = document.getElementById("expenseSearchInput");
    if (expSearch) expSearch.addEventListener("input", function(e) { state.expenseSearchQuery = e.target.value; renderExpenseTable(); });
    var expCatFilter = document.getElementById("expenseCategoryFilter");
    if (expCatFilter) expCatFilter.addEventListener("change", function(e) { state.expenseCategoryFilter = e.target.value; renderExpenseTable(); });

    // Student modal
    var openStudentBtn = document.getElementById("openStudentModalBtn");
    if (openStudentBtn) openStudentBtn.addEventListener("click", openStudentModal);
    var closeStudentBtn = document.getElementById("closeStudentModalBtn");
    if (closeStudentBtn) closeStudentBtn.addEventListener("click", function() { state.editingStudentId = null; closeModal("studentModal"); });
    var studentForm = document.getElementById("studentForm");
    if (studentForm) studentForm.addEventListener("submit", handleStudentFormSubmit);

    // Payment modal
    var openPayBtn = document.getElementById("openAddModalBtn");
    var quickPayBtn = document.getElementById("quickAddBtn");
    if (openPayBtn) openPayBtn.addEventListener("click", function() { openPaymentModal(null); });
    if (quickPayBtn) quickPayBtn.addEventListener("click", function() { openPaymentModal(null); });
    var closePayBtn = document.getElementById("closePaymentModalBtn");
    var cancelPayBtn = document.getElementById("cancelPaymentModalBtn");
    if (closePayBtn) closePayBtn.addEventListener("click", function() { closeModal("paymentModal"); });
    if (cancelPayBtn) cancelPayBtn.addEventListener("click", function() { closeModal("paymentModal"); });
    var payForm = document.getElementById("paymentForm");
    if (payForm) payForm.addEventListener("submit", handlePaymentFormSubmit);

    // Payment type & options listeners
    var tipeSelect = document.getElementById("paymentTipe");
    if (tipeSelect) tipeSelect.addEventListener("change", handlePaymentTipeChange);

    var multiCountSelect = document.getElementById("paymentMultiBulanCount");
    if (multiCountSelect) multiCountSelect.addEventListener("change", updateMultiBulanPreview);

    var payStudent = document.getElementById("paymentStudentSelect");
    var payBulan = document.getElementById("paymentBulan");
    if (payStudent) payStudent.addEventListener("change", function() {
        if (tipeSelect && tipeSelect.value === "mingguan") updateMingguOptions();
    });
    if (payBulan) payBulan.addEventListener("change", function() {
        if (tipeSelect && tipeSelect.value === "multi_bulan") updateMultiBulanPreview();
        else if (tipeSelect && tipeSelect.value === "mingguan") updateMingguOptions();
    });

    var customNominalInput = document.getElementById("paymentCustomNominal");
    if (customNominalInput) customNominalInput.addEventListener("input", updateCustomNominalDisplay);

    // Quick Nominal Chips
    document.querySelectorAll(".chip-nominal-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            var add = parseInt(btn.dataset.add, 10) || 0;
            var cur = customNominalInput ? (parseInt(customNominalInput.value, 10) || 0) : 0;
            if (customNominalInput) {
                customNominalInput.value = cur + add;
                updateCustomNominalDisplay();
            }
        });
    });

    var chipSisaBtn = document.getElementById("chipBayarSisaBtn");
    if (chipSisaBtn) {
        chipSisaBtn.addEventListener("click", function() {
            var stId = payStudent ? payStudent.value : null;
            var bln = payBulan ? payBulan.value : state.activeBulan;
            if (!stId) {
                showToast("Pilih Siswa", "Pilih siswa terlebih dahulu untuk menghitung sisa.", "warning");
                return;
            }
            var totalPaid = getStudentTotalForMonth(stId, bln);
            var sisa = Math.max(0, KAS_CONFIG.BULANAN - totalPaid);
            if (customNominalInput) {
                customNominalInput.value = sisa;
                updateCustomNominalDisplay();
            }
        });
    }

    // Expense modal
    var openExpBtn = document.getElementById("openExpenseModalBtn");
    var quickExpBtn = document.getElementById("quickExpenseBtn");
    if (openExpBtn) openExpBtn.addEventListener("click", openExpenseModal);
    if (quickExpBtn) quickExpBtn.addEventListener("click", openExpenseModal);
    var closeExpBtn = document.getElementById("closeExpenseModalBtn");
    var cancelExpBtn = document.getElementById("cancelExpenseModalBtn");
    if (closeExpBtn) closeExpBtn.addEventListener("click", function() { closeModal("expenseModal"); });
    if (cancelExpBtn) cancelExpBtn.addEventListener("click", function() { closeModal("expenseModal"); });
    var expForm = document.getElementById("expenseForm");
    if (expForm) expForm.addEventListener("submit", handleExpenseFormSubmit);

    // Detail modal
    var closeDetailBtn = document.getElementById("closeDetailModalBtn");
    var closeDetailFoot = document.getElementById("closeDetailFooterBtn");
    if (closeDetailBtn) closeDetailBtn.addEventListener("click", function() { closeModal("detailModal"); });
    if (closeDetailFoot) closeDetailFoot.addEventListener("click", function() { closeModal("detailModal"); });

    // Delete modal
    var closeDelBtn = document.getElementById("closeDeleteModalBtn");
    var cancelDelBtn = document.getElementById("cancelDeleteBtn");
    var confirmDelBtn = document.getElementById("confirmDeleteBtn");
    if (closeDelBtn) closeDelBtn.addEventListener("click", function() { closeModal("deleteModal"); });
    if (cancelDelBtn) cancelDelBtn.addEventListener("click", function() { closeModal("deleteModal"); });
    if (confirmDelBtn) confirmDelBtn.addEventListener("click", confirmDelete);

    // Export
    var expDropBtn = document.getElementById("exportDropdownBtn");
    var expDropMenu = document.getElementById("exportDropdownMenu");
    if (expDropBtn && expDropMenu) {
        expDropBtn.addEventListener("click", function(e) { e.stopPropagation(); expDropMenu.classList.toggle("show"); });
        document.addEventListener("click", function() { expDropMenu.classList.remove("show"); });
    }
    var csvBtn = document.getElementById("exportCsvBtn");
    var jsonBtn = document.getElementById("exportJsonBtn");
    var pdfBtn = document.getElementById("exportPdfBtn");
    if (csvBtn) csvBtn.addEventListener("click", exportToCSV);
    if (jsonBtn) jsonBtn.addEventListener("click", exportToJSON);
    if (pdfBtn) pdfBtn.addEventListener("click", exportToPDF);

    // Import
    var openImpBtn = document.getElementById("openImportModalBtn");
    var closeImpBtn = document.getElementById("closeImportModalBtn");
    var cancelImpBtn = document.getElementById("cancelImportBtn");
    var fileInput = document.getElementById("jsonFileInput");
    var confirmImpBtn = document.getElementById("confirmImportBtn");
    if (openImpBtn) openImpBtn.addEventListener("click", function() {
        var prev = document.getElementById("fileNamePreview"); if (prev) prev.textContent = "";
        if (confirmImpBtn) confirmImpBtn.disabled = true; state.pendingImportData = null; openModal("importModal");
    });
    if (closeImpBtn) closeImpBtn.addEventListener("click", function() { closeModal("importModal"); });
    if (cancelImpBtn) cancelImpBtn.addEventListener("click", function() { closeModal("importModal"); });
    if (fileInput) fileInput.addEventListener("change", handleFileSelect);
    if (confirmImpBtn) confirmImpBtn.addEventListener("click", confirmImport);

    // Print
    function triggerPrintReport() {
        renderPrintTable(getFilteredRecap());
        window.print();
    }

    var printBtn = document.getElementById("printReportBtn");
    var quickPrint = document.getElementById("quickPrintBtn");
    if (printBtn) printBtn.addEventListener("click", triggerPrintReport);
    if (quickPrint) quickPrint.addEventListener("click", triggerPrintReport);

    window.addEventListener("beforeprint", function() {
        renderPrintTable(getFilteredRecap());
    });

    // ==========================================================================
    // 3-STEP RESET CONFIRMATION WIZARD
    // ==========================================================================
    var openResetBtn = document.getElementById("openResetModalBtn");
    var closeResetBtn = document.getElementById("closeResetModalBtn");
    var cancelReset1Btn = document.getElementById("cancelResetStep1Btn");
    var gotoStep2Btn = document.getElementById("gotoStep2Btn");
    var backToStep1Btn = document.getElementById("backToStep1Btn");
    var gotoStep3Btn = document.getElementById("gotoStep3Btn");
    var backToStep2Btn = document.getElementById("backToStep2Btn");
    var finalDeleteAllBtn = document.getElementById("finalDeleteAllBtn");

    var resetCheck1 = document.getElementById("resetCheck1");
    var resetCheck2 = document.getElementById("resetCheck2");
    var resetCheck3 = document.getElementById("resetCheck3");
    var resetConfirmInput = document.getElementById("resetConfirmInput");

    function openResetAllModal() {
        // Reset to Step 1
        document.getElementById("resetStep1").classList.add("active");
        document.getElementById("resetStep2").classList.remove("active");
        document.getElementById("resetStep3").classList.remove("active");

        var b1 = document.getElementById("stepBadge1");
        var b2 = document.getElementById("stepBadge2");
        var b3 = document.getElementById("stepBadge3");
        var l1 = document.getElementById("stepLine1");
        var l2 = document.getElementById("stepLine2");

        if (b1) { b1.className = "step-badge active"; }
        if (b2) { b2.className = "step-badge"; }
        if (b3) { b3.className = "step-badge"; }
        if (l1) { l1.className = "step-line"; }
        if (l2) { l2.className = "step-line"; }

        // Populate Impact Summary
        var sumStudents = document.getElementById("resetSummaryStudents");
        var sumPayments = document.getElementById("resetSummaryPayments");
        var sumExpenses = document.getElementById("resetSummaryExpenses");
        if (sumStudents) sumStudents.textContent = state.students.length + " Siswa";
        if (sumPayments) sumPayments.textContent = state.payments.length + " Pembayaran";
        if (sumExpenses) sumExpenses.textContent = state.expenses.length + " Transaksi";

        // Reset step 2 inputs
        if (resetCheck1) resetCheck1.checked = false;
        if (resetCheck2) resetCheck2.checked = false;
        if (resetCheck3) resetCheck3.checked = false;
        if (gotoStep3Btn) gotoStep3Btn.disabled = true;

        // Reset step 3 inputs
        if (resetConfirmInput) resetConfirmInput.value = "";
        if (finalDeleteAllBtn) finalDeleteAllBtn.disabled = true;

        openModal("resetModal");
    }

    if (openResetBtn) openResetBtn.addEventListener("click", openResetAllModal);
    if (closeResetBtn) closeResetBtn.addEventListener("click", function() { closeModal("resetModal"); });
    if (cancelReset1Btn) cancelReset1Btn.addEventListener("click", function() { closeModal("resetModal"); });

    // Step 1 -> Step 2
    if (gotoStep2Btn) gotoStep2Btn.addEventListener("click", function() {
        document.getElementById("resetStep1").classList.remove("active");
        document.getElementById("resetStep2").classList.add("active");

        var b1 = document.getElementById("stepBadge1");
        var b2 = document.getElementById("stepBadge2");
        var l1 = document.getElementById("stepLine1");
        if (b1) b1.className = "step-badge completed";
        if (l1) l1.className = "step-line active";
        if (b2) b2.className = "step-badge active";
    });

    // Step 2 -> Step 1
    if (backToStep1Btn) backToStep1Btn.addEventListener("click", function() {
        document.getElementById("resetStep2").classList.remove("active");
        document.getElementById("resetStep1").classList.add("active");

        var b1 = document.getElementById("stepBadge1");
        var b2 = document.getElementById("stepBadge2");
        var l1 = document.getElementById("stepLine1");
        if (b1) b1.className = "step-badge active";
        if (l1) l1.className = "step-line";
        if (b2) b2.className = "step-badge";
    });

    // Checkbox checklist validation
    function validateStep2Checkboxes() {
        var allChecked = resetCheck1 && resetCheck1.checked &&
                         resetCheck2 && resetCheck2.checked &&
                         resetCheck3 && resetCheck3.checked;
        if (gotoStep3Btn) gotoStep3Btn.disabled = !allChecked;
    }
    if (resetCheck1) resetCheck1.addEventListener("change", validateStep2Checkboxes);
    if (resetCheck2) resetCheck2.addEventListener("change", validateStep2Checkboxes);
    if (resetCheck3) resetCheck3.addEventListener("change", validateStep2Checkboxes);

    // Step 2 -> Step 3
    if (gotoStep3Btn) gotoStep3Btn.addEventListener("click", function() {
        document.getElementById("resetStep2").classList.remove("active");
        document.getElementById("resetStep3").classList.add("active");

        var b2 = document.getElementById("stepBadge2");
        var b3 = document.getElementById("stepBadge3");
        var l2 = document.getElementById("stepLine2");
        if (b2) b2.className = "step-badge completed";
        if (l2) l2.className = "step-line active";
        if (b3) b3.className = "step-badge active";

        if (resetConfirmInput) {
            resetConfirmInput.value = "";
            setTimeout(function() { resetConfirmInput.focus(); }, 150);
        }
    });

    // Step 3 -> Step 2
    if (backToStep2Btn) backToStep2Btn.addEventListener("click", function() {
        document.getElementById("resetStep3").classList.remove("active");
        document.getElementById("resetStep2").classList.add("active");

        var b2 = document.getElementById("stepBadge2");
        var b3 = document.getElementById("stepBadge3");
        var l2 = document.getElementById("stepLine2");
        if (b2) b2.className = "step-badge active";
        if (l2) l2.className = "step-line";
        if (b3) b3.className = "step-badge";
    });

    // Step 3 phrase input validation
    if (resetConfirmInput) {
        resetConfirmInput.addEventListener("input", function() {
            var val = resetConfirmInput.value.trim().toUpperCase();
            if (finalDeleteAllBtn) {
                finalDeleteAllBtn.disabled = (val !== "HAPUS SEMUA DATA");
            }
        });
    }

    // Final Delete Action
    if (finalDeleteAllBtn) {
        finalDeleteAllBtn.addEventListener("click", function() {
            state.students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
            state.payments = [];
            state.expenses = [];
            localStorage.setItem("gokas_students", JSON.stringify(state.students));
            localStorage.removeItem("gokas_payments");
            localStorage.removeItem("gokas_expenses");
            if (localStorage.getItem("gokas_records")) localStorage.removeItem("gokas_records");

            saveStateToStorage();
            refreshAll();
            renderStudentListInModal();
            closeModal("resetModal");
            showToast("Data Kas Berhasil Direset", "Seluruh catatan uang kas dan pengeluaran telah dibersihkan. Daftar 34 siswa tetap tersimpan.", "info");
        });
    }

    // Clean old localStorage
    if (localStorage.getItem("gokas_records")) localStorage.removeItem("gokas_records");
});
