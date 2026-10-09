/**
 * FrequencyChart Component
 * Visualizes ciphertext letter frequencies alongside expected English frequencies.
 * Uses pure HTML/CSS bars for lightweight, responsive, and dependency-free rendering.
 */
export default function FrequencyChart({ sortedData }) {
  // Find highest percentage to normalize the bar height
  const maxPercent = Math.max(
    ...sortedData.map((d) => Math.max(d.percentage, d.expectedPercentage)),
    14
  );

  return (
    <div className="frequency-chart-card">
      <div className="frequency-chart-header">
        <div>
          <h4>Ciphertext vs. Standard English Letter Frequency (%)</h4>
          <p>
            Compare observed letter frequencies against the natural distribution of English text.
          </p>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-box cipher-box"></span>
            <span>Ciphertext %</span>
          </div>
          <div className="legend-item">
            <span className="legend-box expected-box"></span>
            <span>Expected English %</span>
          </div>
        </div>
      </div>

      <div className="chart-scroll-wrapper">
        <div className="chart-bars-container">
          {sortedData.map((item) => {
            const cipherHeight = `${Math.min(100, (item.percentage / maxPercent) * 100)}%`;
            const expectedHeight = `${Math.min(100, (item.expectedPercentage / maxPercent) * 100)}%`;

            return (
              <div
                key={item.letter}
                className="chart-bar-column"
                title={`Letter '${item.letter}': Cipher = ${item.percentage}%, Expected = ${item.expectedPercentage}% (Count: ${item.count})`}
              >
                <div className="bar-values-tip">
                  <span className="cipher-val">{item.percentage}%</span>
                </div>

                <div className="bars-pair">
                  <div
                    className="bar-track expected-bar"
                    style={{ height: expectedHeight }}
                  ></div>
                  <div
                    className="bar-track cipher-bar"
                    style={{ height: cipherHeight }}
                  ></div>
                </div>

                <div className="bar-label">{item.letter}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
