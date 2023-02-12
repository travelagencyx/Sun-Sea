using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace sunandseasplit.Function
{
    public class HttpTrigger1
    {
        private readonly ILogger _logger;

        public HttpTrigger1(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<HttpTrigger1>();
        }

        [Function("SendEmail")]
        public async Task Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
        {

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string toEmail = data?.to;
            string subject = data?.subject;
            string message = data?.text;

            var apiKey = Environment.GetEnvironmentVariable("SendGrid_ApiKey");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("karlojurcevic123@gmail.com", "Example");
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, message, message);
            var response = await client.SendEmailAsync(msg);

        }
    }
}
