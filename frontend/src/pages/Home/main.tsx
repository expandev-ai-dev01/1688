/**
 * @page HomePage
 * @summary Home page displaying weather information
 * @domain weather
 * @type dashboard-page
 * @category public
 */

export const HomePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">WeatherNow</h1>
        <p className="text-lg text-gray-600">Weather information at your fingertips</p>
      </div>
    </div>
  );
};

export default HomePage;
