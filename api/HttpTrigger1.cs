using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

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
        public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string toEmail = data?.to;
            string subject = data?.subject;
            string message = data?.text;

            if (string.IsNullOrEmpty(toEmail)  string.IsNullOrEmpty(subject)  string.IsNullOrEmpty(message))
            {
                return new BadRequestObjectResult("Please provide all required fields (toEmail, subject, message)");
            }

            var apiKey = Environment.GetEnvironmentVariable("SendGrid_ApiKey");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("travelagencyx@gmail.com", "Example");
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, message, message);
            var response = await client.SendEmailAsync(msg);

            if (response.StatusCode == System.Net.HttpStatusCode.Accepted)
            {
                return new OkObjectResult("Email sent successfully.");
            }
            else
            {
                return new BadRequestObjectResult("Failed to send email.");
            }
    }
}
