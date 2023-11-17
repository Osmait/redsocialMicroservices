package middleware

import (
	"fmt"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
)

var (
	mu            sync.Mutex
	requests      = make(map[string]int)
	requestsMutex sync.RWMutex
)

var accessCounter = prometheus.NewCounterVec(
	prometheus.CounterOpts{
		Name: "endpoint_access_count",
		Help: "Total number of accesses to the endpoint",
	},
	[]string{"endpoint"},
)

func RecordEndpointAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Incrementar el contador de acceso
		endpoint := c.FullPath()
		accessCounter.WithLabelValues(endpoint).Inc()

		// Incrementar el contador local
		requestsMutex.Lock()
		requests[endpoint]++
		requestsMutex.Unlock()

		c.Next()
	}
}

var latency = prometheus.NewSummaryVec(
	prometheus.SummaryOpts{
		Namespace:  "api",
		Name:       "latency_seconds",
		Help:       "Latency distributions.",
		Objectives: map[float64]float64{0.5: 0.05, 0.9: 0.01, 0.99: 0.001},
	},
	[]string{"method", "path"},
)

func RegisterPrometheusMetrics() {
	prometheus.MustRegister(latency)
	prometheus.MustRegister(accessCounter)
}

func RecordRequestLatency() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		c.Next()
		fmt.Println(c.Request.RequestURI)
		l := time.Since(t).Seconds()
		latency.WithLabelValues(

			c.Request.Method,
			c.Request.URL.Path,
		).Observe(l)
	}
}
