const Util = {
    get N() {
        return $("#arg1").val();
    },
    get S() {
        var arg = $("#arg2").val().trim();
        if (arg.length == Util.N && /^[01]+$/.test(arg)) {
            return parseInt(arg, 2);
        } else {
            return NaN;
        }
    },
    get A() {
        var arg = $("#arg3").val().trim();
        if (arg.length == Util.N && /^[01]+$/.test(arg)) {
            return parseInt(arg, 2);
        } else {
            return NaN;
        }
    },
    // 穷举2^N种可能解法，并返回所有解法
    // 调用方法：Util.solve(24, 0b100001001110100100110100, 0b111010101010100010101110);
    // 返回数据：[0b000000100011101011110111, …]
    solve: (N, S, A) => {
        "use strict";
        const M = 1 << N;
        let results = [];
        let AA = [];
        for (let aa = A, i = 0; i < N; i++) {
            AA.push(aa);
            aa = ((aa & 1) << N-1) | (aa >> 1);
        }
        for (let k = 0; k < M; k++) {
            let xx = S;
            for (let i = N-1, kk = k; kk > 0; kk >>= 1) {
                let aa = AA[i--];
                if (kk & 1) {
                    xx = (xx & ~aa) | (xx & aa ^ aa);
                }
            }
            if (xx == 0 || xx == M - 1) {
                results.push(k);
            }
        }
        return results;
    },
    // 选择一种解法，返回全过程
    // 调用方法：Util.details(24, 0b100001001110100100110100, 0b111010101010100010101110, 0b000000100011101011110111);
    // 返回数据：[[7, 0b001111110100001110010110], …]
    details: (N, xx, aa, kk) => {
        "use strict";
        const M = 1 << N;
        let results = [];
        let sbin = kk.toString(2);
        sbin = "0".repeat(N - sbin.length) + sbin;
        for (let i = 0; i < N; i++) {
            if (sbin[i] == "1") {
                xx = (xx & ~aa) | (xx & aa ^ aa);
                results.push([i + 1, xx]);
            }
            aa = ((aa & 1) << N-1) | (aa >> 1);
        }
        return results;
    }
}
$(() => {
    $("#arg1").trigger("input");
});
$("#arg1").on("input", () => {
    $("#tip1").text(`当前已设置点数：${Util.N}`);
});
$("#btn1").on("click", () => {
    var N = Util.N,
        S = Util.S,
        A = Util.A;
    if (isNaN(S)) {
        $("#tip4").text(`第二步输入错误，请检查！`);
        return false;
    }
    if (isNaN(A)) {
        $("tip4").text(`第三步输入错误，请检查！`);
        return false;
    }
    var ts = Date.now();
    var results = Util.solve(N, S, A);
    ts = Date.now() - ts;
    $("#tip4").text(`共找到${results.length}组解法，耗时${ts}ms。`);
    $("ul#results").html(results.map(result => {
        var sbin = result.toString(2);
        var moves = sbin.split("").reduce((sum, c) => sum + c * 1, 0);
        sbin = "0".repeat(Util.N - sbin.length) + sbin;
        return `<li class="list-group-item" data-result="${result}"><span class="badge">${moves}步</span>${sbin}</li>`;
    }).join(""));
});
$("#btn-test-a").on("click", () => {
    $("#arg1").val(24).trigger("input");
    $("#arg2").val("000011001010100101101100");
    $("#arg3").val("101010101101101010111000");
});
$("#btn-test-b").on("click", () => {
    $("#arg1").val(24).trigger("input");
    $("#arg2").val("100001001110100100110100");
    $("#arg3").val("111010101010100010101110");
});
$("#btn-test-c").on("click", () => {
    $("#arg1").val(24).trigger("input");
    $("#arg2").val("100000111100010111100011");
    $("#arg3").val("101010110110100010111010");
});
$("ul#results").on("click", "li", (event) => {
    var kk = $(event.currentTarget).data("result") * 1;
    var results = Util.details(Util.N, Util.S, Util.A, kk);
    var points = results.map(result => result[0]);
    $("#tip5").text(`请选中第${points.join(",")}点，各进行一次变换。`);
    $("ul#details").html(results.map(result => {
        var [i, sbin] = result;
        sbin = sbin.toString(2);
        sbin = "0".repeat(Util.N - sbin.length) + sbin;
        return `<li class="list-group-item"><span class="badge">第${i}个点</span>${sbin}</li>`;
    }).join(""));
});
