package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
)

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
}

func RecordRequestLatency() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		c.Next()

		l := time.Since(t).Seconds()
		latency.WithLabelValues(
			c.Request.Method,
			c.Request.URL.Path,
		).Observe(l)
	}
}
