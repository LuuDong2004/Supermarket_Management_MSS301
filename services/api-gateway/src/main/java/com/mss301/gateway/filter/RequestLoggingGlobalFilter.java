package com.mss301.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Lightweight access log: method, path and resulting status per request.
 */
@Slf4j
@Component
public class RequestLoggingGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String method = exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getURI().getPath();
        long start = System.nanoTime();

        return chain.filter(exchange).doFinally(signal -> {
            long tookMs = (System.nanoTime() - start) / 1_000_000;
            var status = exchange.getResponse().getStatusCode();
            log.info("{} {} -> {} ({} ms)", method, path, status, tookMs);
        });
    }

    @Override
    public int getOrder() {
        // Outermost: log around everything, including auth rejections.
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
